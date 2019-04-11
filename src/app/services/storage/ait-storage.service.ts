/*
    AIT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observer, PartialObserver, Subscription } from 'rxjs';
import { distinct, skip } from 'rxjs/operators';
import { AppUtils, error, log, warn } from 'src/app/app.utils';
import { StorageDefaultData } from './ait-storage.defaultdata';
import { AppStorageData, UUIDData } from './ait-storage.shapes';



export interface CacheSubject<T extends UUIDData> {
  uuid: string;
  routable: boolean;
  subject: BehaviorSubject<T>;
  observer: PartialObserver<T>;
  subscription: Subscription;
}

@Injectable({
  providedIn: 'root'
})
export class AITStorage {
  private status: 'off' | 'booting' | 'on';
  private subjects: Array<CacheSubject<any>>;

  constructor(private storage: Storage) {
    this.status = 'off';
    this.subjects = [];
  }

  /**
   * Checks the storage cache (`this.subjects`) for first found subject with the same `uuid`. If
   * not found, it will hit the device's disk by calling `this.getPagePromise()` and push subject
   * into cache.
   *
   * @param uuid the key to storage record
   */
  async getPromiseSubject<T extends UUIDData>(uuid: string): Promise<BehaviorSubject<T>> {
    let hardData: T | any;
    const noSoftData: boolean = this.subjects.findIndex(element => element.uuid === uuid) === -1;

    // no softdata; then store it
    if (noSoftData === true) {
      log('-hard->', uuid);
      hardData = await this.getHardData(uuid);
      log('<-hard-', hardData.uuid);
      log('-soft->', uuid);
      this.storeSoftData(hardData);
      log('<-soft-', hardData.uuid);
    }
    log('-resoft->', uuid);
    // now get softdata
    const soft = this.restoreSoftData<T>(uuid);
    log('<-resoft-', soft.uuid);

    if ((soft.routable === true) && (uuid !== StorageDefaultData.APP_ID)) {
      await this.updateAppsCurrentUUID(uuid);
    }

    return Promise.resolve(soft.subject);
  }

  /**
   * As an internal method it has no concern to check (`this.subjects`) or write to caching. Once
   * storage is in the `on` status it will retrieve data with `uuid` as its key by calling
   * `getData()`. If no data is returned at this time, it will retrieve the default data by
   * using `AppUtils.getPageDataByID()`.
   *
   * @param uuid the key to storage record
   */
  private async getHardData<T extends UUIDData>(uuid: string): Promise<T> {
    const isReady = await this.isReady();

    if (isReady) {
      // TODO: cache these somehow
      const keys = await this.storage.keys();
      let results;
      if (keys.includes(uuid) === false) {
        const defaultdata = AppUtils.getDataByID(uuid) as T;
        await this.setData(defaultdata);
        results = Promise.resolve(defaultdata);
      } else {
        results = await this.storage.get(uuid);
      }

      return results;
    }
  }

  /**
   * The only point of access to `storage.set()` to store data
   *
   * @param value data to store with `uuid` as its storage key
   */
  private async setData<T extends UUIDData>(value: T): Promise<void> {
    log('[', value.uuid, '] storing:', value);
    return await this.storage.set(value.uuid, value)
      .then(() => {
        log('[', value.uuid, '] stored');
      }, (rejected) => {
        error('[', value.uuid, ']', rejected, value);
      })
      .catch((reason) => {
        error('[', value.uuid, ']', reason);
      });
  }

  /**
   * Instantiates BehaviorSubject with `data` and stores a record of it in `this.subjects`.
   *
   * @param data UUID data type
   */
  private storeSoftData<T extends UUIDData>(data: T): void {
    this.subjects.push({
      uuid: data.uuid,
      routable: data.routable,
      subject: new BehaviorSubject<T>(data),
      observer: this.createObserver(data.uuid),
      subscription: undefined
    });
    log('[', data.uuid, '] cache is now:', this.subjects);
  }

  /**
   * Retrieves soft entry and if BehaviorSubject has no observers a subscription will be created.
   */
  private restoreSoftData<T extends UUIDData>(uuid: string): CacheSubject<T> {
    const entry = this.subjects.find(element => element.uuid === uuid);

    if (entry.subject.observers.length === 0) {
      const subscription = entry.subject.pipe(skip(1), distinct()).subscribe(entry.observer);
      entry.subscription = subscription;
    }

    return entry as CacheSubject<T>;
  }

  private createObserver<T extends UUIDData>(uuid: string): Observer<T> {
    return {
      closed: false,
      next: (value: T): void => {
        this.setData(value);
      },
      error: (err: any): void => {
        error('[', uuid, ']', err);
      },
      complete: (): void => {
        warn('[', uuid, ']', 'completed');
      }
    };
  }

  private updateAppsCurrentUUID(uuid: string): Promise<void> {
    // safely assuming appData is already stored...
    const soft = this.restoreSoftData<AppStorageData>(StorageDefaultData.APP_ID);
    const appData = soft.subject.getValue();
    appData.current_uuid = uuid;
    // since this field is only used on app startup, bypass store appData thru soft.subject.
    return this.setData(appData);
  }

  /**
   * Ensures that storage is in its "on" state.
   */
  private async isReady(): Promise<boolean> {
    if (this.status === 'on') {
      return Promise.resolve(true);
    } else if (this.status === 'off') {
      this.status = 'booting';
      return await this.storage.ready()
        .then(async (value: LocalForage): Promise<any> => {
          this.status = 'on';
          return Promise.resolve(true);
        });
    } else {
      return Promise.resolve(false);
    }
  }
}
