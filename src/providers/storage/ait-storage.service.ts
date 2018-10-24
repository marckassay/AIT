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
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { UUIDData, AppStorageData } from './ait-storage.interfaces';
import { Subject, Observable, Subscription } from 'rxjs';
import { StorageDefaultData } from './ait-storage.defaultdata';

@Injectable()
export class AITStorage {
  private status: 'off' | 'booting' | 'on';
  private pageObservableSubject: Array<[Subject<UUIDData>, Observable<UUIDData>]>;
  private currentPageSubscription: Subscription | undefined;
  private preOpPromise: Promise<boolean>;
  private cache: Array<UUIDData>;

  constructor(public storage: Storage) {
    this.status = "off";
    this.pageObservableSubject = [];
    this.cache = [];
  }


  getPagePromiseAndSubject<T extends UUIDData>(uuid: string): [Promise<T>, Subject<T>] {
    return [this.getPagePromise(uuid), this.getPageSubject(uuid)];
  }

  /**
   * Returns a subclass of UUIDData that is intended to be only used for reading info. If reading
   * and writing is needed, use the `getPagePromise` method.
   *
   * @param uuid every page has a uuid assigned to it
   */
  getPagePromise<T extends UUIDData>(uuid: string): Promise<T> {
    return this.isReady().then((): Promise<T> => {
      return this.getCached<T>(uuid);
    });
  }

  /**
   * Returns a `Subject` that is intended to be "written" to which will be observed by the
   * `Observable` and in turn update cache then storage.
   *
   * @param uuid every page has a uuid assigned to it
   */
  getPageSubject<T extends UUIDData>(uuid: string): Subject<T> {
    /*
    return this.isReady().then((): Promise<T> => {
          return this.getCached<T>(uuid);
    });
    */
    const pair: [Subject<T>, Observable<T>] = this.getPageObserverableSubject();
    this.setCurrentPageAndSubscribe(pair[1]);

    return pair[0] as Subject<T>;
  }

  /**
   * Ensures that storage is in its "on" state.
   */
  private isReady(): Promise<boolean> {
    if (this.status === "on") {
      return Promise.resolve(true);
    } else {
      if (this.status === "off") {
        this.status = "booting";
        this.preOpPromise = this.preOperationCheck();
      }
      return this.preOpPromise;
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
          console.log("Storage is getting data from disk.");
          return this.storage.get(StorageDefaultData.APP_ID) as Promise<AppStorageData>;
        } else {
          console.log("Storage can't boot-up!");
          // TODO: need to handle this downstream...
          return Promise.reject(new Error('sum ting wong'));
        }
      })
      .then((value: AppStorageData | undefined): Promise<boolean> => {
        // if in 'booting' routine, set status to 'on' since
        // the following set() will call preOperationCheck()...
        if (this.status === 'booting') {
          this.status = "on";
        }

        // as intended, value should always be undefined.
        if (value === undefined) {
          return this.storage.set(StorageDefaultData.APP_ID, StorageDefaultData.APP_DATA)
            .then((): Promise<boolean> => {
              return this.setCached(StorageDefaultData.APP_DATA);
            });
        }
        // this else isn't intended to ever be executed, its a just-in-case:
        else {
          return this.setCached(value);
        }
      })
      .catch((reason: any) => {
        console.error(reason);
        this.status = "off";
        return new Promise<boolean>((resolve, reject) => { resolve(false); });
      });
  }

  private getCached<T>(uuid: string): Promise<T> {
    let returnPromise = (value): Promise<T> => {
      return new Promise<T>((resolve, reject) => { resolve(value); });
    };

    const cached: UUIDData | undefined = this.cache.find(value => value.uuid === uuid);

    // no cache data... no problem, get UUIDData from storage...
    if (!cached) {
      return this.storage.get(uuid).then((value): Promise<T> => {
        // no storage data... no problem, get UUIDData from default data and proceed with normal
        // operation...
        if (!value) {
          let genVal: new () => T;
          return this.setCached(StorageDefaultData[typeof genVal]).then(() => {
            return returnPromise(value);
          });
        } else {
          return returnPromise(value);
        }
      });
    } else {
      return returnPromise(cached);
    }
  }

  /**
   * Checks exisiting cache with `data.uuid`. If no element is found
   *
   * @param data The value to be stored in `storage`.
   * @param returns `Promise<boolean>` to be passed downstream if needed.
   */
  private setCached(data: UUIDData): Promise<boolean> {
    const indexOfCached: number = this.cache.findIndex(value => value.uuid === data.uuid);

    if (indexOfCached) {
      this.cache[indexOfCached] = data;
    } else {
      this.cache.push(data);
    }

    return new Promise<any>((resolve, reject) => { resolve(true); });
  }

  private getPageObserverableSubject<T extends UUIDData>(): [Subject<T>, Observable<T>] {
    let pair: [Subject<UUIDData>, Observable<UUIDData>] | undefined = this.pageObservableSubject.find((value: [Subject<T>, Observable<T>]) => {
      console.log(value);
      return true;
    });

    if (pair === undefined) {
      const subject: Subject<T> = new Subject<T>();
      const observable: Observable<T> = subject.asObservable();
      pair = [subject, observable];
    }

    return pair as [Subject<T>, Observable<T>];
  }

  private setCurrentPageAndSubscribe(observable: Observable<UUIDData>): void {
    // unsubscribe currentPageObservable if any...
    if (!(this.currentPageSubscription!.closed)) {
      this.currentPageSubscription.unsubscribe();
    }

    this.currentPageSubscription = observable.subscribe(
      (value: UUIDData) => {

      },
      (error: any) => {
        console.error("sum ting wong.");
      }
    );
  }
}
