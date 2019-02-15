/**
    AiT - Another Interval Timer
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
import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, merge, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AppUtils } from 'src/app/app.utils';

import { StorageDefaultData } from './ait-storage.defaultdata';
import { AppStorageData, UUIDData } from './ait-storage.shapes';

export interface CacheSubject<T extends UUIDData> {
  uuid: string;
  subject: BehaviorSubject<T>;
  routable: boolean;
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
    return from(this.getPromiseSubject(uuid)) as Observable<BehaviorSubject<T>>;
  }

  /**
   * Checks the storage cache (`this.subjects`) for first found subject with the same `uuid`. If
   * not found, it will hit the device's disk by calling `this.getPagePromise()` and push subject
   * into cache.
   *
   * @param uuid the key to storage record
   */
  async getPromiseSubject<T extends UUIDData>(uuid: string): Promise<BehaviorSubject<T>> {
    const entry: CacheSubject<T> | undefined = this.subjects.find(element => element.uuid === uuid);

    if (entry === undefined) {
      return await this.getPagePromise<T>(uuid).then((value) => {
        if (value.routable === true) {
          return this.registerSubject(value);
        } else {
          return this.addAsCacheSubject<T>(value);
        }
      });
    } else {
      if (entry.routable === true) {
        return this.registerSubject<T>(entry);
      } else {
        return entry.subject;
      }
    }
  }

  // TODO: enable the 2 operators
  // merge().pipe(
  // debounceTime(5000),
  // distinctUntilChanged()
  // );
  /**
   *
   *
   * @param value: T | CacheSubject<T>
   */
  private async registerSubject<T extends UUIDData>(value: T | CacheSubject<T>): Promise<BehaviorSubject<T>> {
    let appcache: CacheSubject<AppStorageData> | undefined;
    let subject: BehaviorSubject<T>;

    // if observable is undefined, this should be the initial startup request for AppStorageData
    if (this.observable === undefined) {
      // create a new subject and push it into cache
      subject = this.addAsCacheSubject<T>(value as T);
      this.observable = subject.asObservable();
    } else {
      // app subject is never unsubscribed. so just return the cache subject
      if (value.uuid === StorageDefaultData.APP_ID) {
        return (value as CacheSubject<T>).subject;
      }

      // if this isn't CacheSubject, then its UUIDData object. so with it create a CacheSubject
      if ('subject' in value === false) {
        subject = this.addAsCacheSubject<T>(value as T);
      } else {
        subject = (value as CacheSubject<T>).subject;
      }

      // get appdata to determine the current_uuid
      let appdata: AppStorageData | undefined;
      appcache = this.subjects.find(element => element.uuid === StorageDefaultData.APP_ID);
      appcache.subject.subscribe(val => appdata = val).unsubscribe();

      // if this requesting subject isn't the current_uuid, set it to current_uuid. And unsubscribe
      // and merge it into appsubject to create a new observable
      if (value.uuid !== appdata.current_uuid) {
        appdata.current_uuid = value.uuid;
        appcache.subject.next(appdata);

        this.subscription.unsubscribe();
        this.observable = merge(appcache.subject, subject);
      } else {
        return subject;
      }
    }

    this.subscription = this.observable.subscribe((val) => {
      this.setData(val);
    });

    return subject;
  }

  /**
   * The only point of access to `storage.set()` to store data
   *
   * @param value data to store with `uuid` as its storage key
   */
  private async setData(value: UUIDData): Promise<void> {
    console.log(value);
    return await this.storage.set(value.uuid, value)
      .then((results) => {
        console.log(results);
      }, (rejected) => {
        console.error(rejected, value);
      })
      .catch((reason) => { console.error(reason, value); });
  }

  /**
   * The only point of access to `storage.get()` to retrieve data
   *
   * @param uuid the storage key
   */
  private async getData<T extends UUIDData>(uuid: string): Promise<T> {
    return await this.storage.get(uuid);
  }

  /**
   * As an internal method it has no concern to check (`this.subjects`) or write to caching. Once
   * storage is in the `on` status it will retrieve data with `uuid` as its key by calling
   * `getData()`. If no data is returned at this time, it will retrieve the default data by
   * using `AppUtils.getPageDataByID()`.
   *
   * @param uuid the key to storage record
   */
  private async getPagePromise<T extends UUIDData>(uuid: string): Promise<T> {
    const results = await this.isReady()
      .then(async (): Promise<T> => {
        const value = await this.getData<T>(uuid);
        if (value) {
          return value;
        } else {
          const defaultdata = AppUtils.getDataByID(uuid);
          await this.setData(defaultdata);
          return defaultdata as T;
        }
      });
    return results;
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
   * Algorithm to be executed just once to ensure that storage is ready to be used and
   * AppStorageData has been loaded.
   */
  private preOperationCheck(): Promise<boolean> {
    return this.storage.ready()
      .then(async (value: LocalForage): Promise<AppStorageData> => {
        if (value) {
          return await this.getData<AppStorageData>(StorageDefaultData.APP_ID);
        } else {
          return Promise.reject(new Error('LOCAL_STORAGE'));
        }
      })
      .then(async (val: AppStorageData | undefined | null): Promise<boolean> => {

        if (this.status === 'booting') {
          this.status = 'on';
        }

        if (!val) {
          const appdata: UUIDData = AppUtils.getDataByID(StorageDefaultData.APP_ID);
          await this.setData(appdata);
          this.addAsCacheSubject(appdata);
        }

        return Promise.resolve(true);
      })
      .catch((reason: any) => {
        console.error(reason);
        this.status = 'off';
        return Promise.reject('LOCAL_STORAGE_FAILED');
      });
  }

  /**
   * Instantiates BehaviorSubject with `data` and stores a record of it in `this.subjects`. Returns
   * the created BehaviorSubject instance.
   *
   * @param data UUID data type
   */
  private addAsCacheSubject<T extends UUIDData>(data: T): BehaviorSubject<T> {
    const subject = new BehaviorSubject<T>(data);

    this.subjects.push({
      uuid: data.uuid,
      subject: subject,
      routable: data.routable
    });

    return subject;
  }
}
