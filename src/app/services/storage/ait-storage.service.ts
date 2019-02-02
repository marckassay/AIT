/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

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
import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, merge, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { AppUtils } from 'src/app/app.utils';

import { StorageDefaultData } from './ait-storage.defaultdata';
import { AppStorageData, UUIDData } from './ait-storage.shapes';

export interface CacheSubject<T extends UUIDData> {
  uuid: string;
  subject: BehaviorSubject<T>;
}

@Injectable({
  providedIn: 'root'
})
export class AITStorage implements OnInit {
  private status: 'off' | 'booting' | 'on';
  private observable: Observable<UUIDData>;
  private subscription: Subscription;
  private subjects: Array<CacheSubject<any>>;

  constructor(private storage: Storage) {
    this.status = 'off';
    this.subjects = [];
  }

  ngOnInit(): void {

  }

  /**
  * This is called directly by the display-page resolvers. Calls `this.getPromiseSubject()` wrapped
  * in `from()`.
  *
  * @param uuid the key to storage record
  */
  getPageObservable<T extends UUIDData>(uuid: string): Observable<BehaviorSubject<T>> {
    return from(this.getPromiseSubject(uuid));
  }

  /**
   * Checks the storage cache for first found subject with the same `uuid`. If not found, it will
   * hit the device's disk by calling `this.getPagePromise()` and push subject into cache.
   *
   * @param uuid the key to storage record
   */
  async getPromiseSubject<T extends UUIDData>(uuid: string): Promise<BehaviorSubject<T>> {
    const entry: CacheSubject<T> | undefined = this.subjects.find(element => element.uuid === uuid);

    if (entry === undefined) {
      return await this.getPagePromise<T>(uuid).then((value) => {
        return this.registerSubject(uuid, value);
      });
    } else {
      return Promise.resolve(entry.subject);
    }
  }

  private registerSubject<T extends UUIDData>(uuid: string, value: T): BehaviorSubject<T> {
    const subject = new BehaviorSubject<T>(value);
    this.subjects.push({ uuid: uuid, subject: subject });

    if (this.observable !== undefined) {
      this.subscription.unsubscribe();
      this.observable = merge(this.observable, subject).pipe(
        skip(1),
        // debounceTime(5000),
        // distinctUntilChanged()
      );
    } else {
      this.observable = subject.asObservable().pipe(
        skip(1),
        // debounceTime(5000),
        // distinctUntilChanged()
      );
    }

    this.subscription = this.observable.subscribe((val) => {
      this.setData(val);
    });

    return subject;
  }

  private async setData(value: UUIDData): Promise<void> {
    return await this.storage.set(value.uuid, value);
  }

  /**
   * As an internal method it has no concern to check (`this.subjects`) or write to caching. Once
   * storage is in the `on` status it will retrieve data with `uuid` as its key. If no data is
   * returned at this time, it will retrieve the default data by using `AppUtils.getPageDataByID()`.
   *
   * @param uuid the key to storage record
   */
  private async getPagePromise<T extends UUIDData>(uuid: string): Promise<T> {
    return await this.isReady().then(async () => {
      const value = await this.storage.get(uuid);
      if (value) {
        return value;
      } else {
        const defaultpage = AppUtils.getPageDataByID(uuid);
        return await this.storage.set(uuid, defaultpage).then(() => {
          return defaultpage;
        });
      }
    });
  }

  /**
   * Ensures that storage is in its "on" state.
   */
  private async isReady(): Promise<boolean> {
    if (this.status === 'on') {
      return Promise.resolve(true);
    } else if (this.status === 'off') {
      this.status = 'booting';
      return await this.preOperationCheck();
    }
  }

  /**
   * Algorithm to be executed once to ensure that storage is ready to be used and APP_DATA has been
   * loaded.
   */
  private preOperationCheck(): Promise<boolean> {
    return this.storage.ready()
      .then((value: LocalForage): Promise<AppStorageData> => {
        if (value) {
          return this.storage.get(StorageDefaultData.APP_ID) as Promise<AppStorageData>;
        } else {
          // TODO: need to handle this downstream...
          return Promise.reject(new Error('sum ting wong'));
        }
      })
      .then((val: AppStorageData | undefined | null): Promise<boolean> => {
        // if in 'booting' routine, set status to 'on' since
        // the following set() will call preOperationCheck()...
        if (this.status === 'booting') {
          this.status = 'on';
        }

        if (!val) {
          const appdata: UUIDData = AppUtils.getPageDataByID(StorageDefaultData.APP_ID);
          return this.storage.set(appdata.uuid, appdata);
          // TODO: cache appdata on startup
          /* .then((): Promise<boolean> => {
            return this.subjects.push({ uuid: appdata.uuid, subject: subject });
          }); */
        } else {
          Promise.resolve(true);
        }
      })
      .catch((reason: any) => {
        console.error(reason);
        this.status = 'off';
        return new Promise<boolean>((resolve, reject): void => { resolve(false); });
      });
  }
}
