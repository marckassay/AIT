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

  getPagePromise<T>(uuid: string): Promise<T> {
    return this.storage.get(uuid);
  }

  getPageSubject<T extends UUIDData>(uuid: string): Subject<T> {
    const pair: [Subject<T>, Observable<T>] = this.getPageObserverableSubject();
    this.setCurrentPageAndSubscribe(pair[1]);

    return pair[0] as Subject<T>;
  }

  private isReady(): Promise<boolean> {
    if (this.status === "on") {
      return Promise.resolve(true);
    } else {
      if (this.status === "off") {
        this.status = "booting";
        this.preOpPromise = this.preOperationCheck();
      }

      if (this.status === "booting") {
        return this.preOpPromise;
      }
    }
  }

  private preOperationCheck(): Promise<boolean> {
    return this.storage.ready()
      .then((value: LocalForage): Promise<AppStorageData> => {
        if (value) {
          console.log("Storage is getting data from disk.");
          return this.getPagePromise<AppStorageData>(StorageDefaultData.APP_ID);
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

        if (value === undefined) {
          return this.storage.set(StorageDefaultData.APP_ID, StorageDefaultData.APP_DATA)
            .then((): Promise<boolean> => {
              return this.setCached<boolean>(StorageDefaultData.APP_DATA);
            });
        } else {
          return this.setCached<boolean>(value);
        }
      })
      .catch((reason: any) => {
        console.error(reason);
        this.status = "off";
        return new Promise<boolean>((resolve, reject) => { resolve(false); });
      });
  }

  private getCached(uuid: string, asyncOperation: boolean = true): Promise<UUIDData | undefined> {
    const cached: UUIDData | undefined = this.cache.find(value => value.uuid === uuid);

    if (asyncOperation) {
      return new Promise((resolve, reject) => { resolve(cached); });
    } else {
      throw new Error("getCached() syncOperation hasn't been implemented.");
    }
  }

  private setCached<T>(data: UUIDData, asyncReturnedType: boolean = true): Promise<T> {
    const indexOfCached: number = this.cache.findIndex(value => value.uuid === data.uuid);

    if (indexOfCached) {
      this.cache[indexOfCached] = data;
    }

    if (asyncReturnedType) {
      let genVal: new () => T;
      if (typeof genVal === "boolean") {
        return new Promise<any>((resolve, reject) => { resolve(true); });
      } else {
        return new Promise<T>((resolve, reject) => { resolve(); });
      }
    } else {
      throw new Error("setCached() syncOperation hasn't been implemented.");
    }
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
      () => {
      },
      () => {
      }
    );
  }
}

/*

  public updateMyObject(newValue) {
  this.pageSubject.next(newValue);

this.myObject.subscribe(
  (data) => { console.log('change detacted'); },
  (error) => {
    console.log(error)
  }
)

*/
  /*
  public checkAppStartupData(): Promise<void> {
    return this.storage.ready().then((value: LocalForage) => {
      this.storage.get(StorageDefaultData.APP_ID).then((value: UUIDData) => {
        if (!value) {
          this.storage.set(StorageDefaultData.APP_ID, StorageDefaultData.APP_DATA);
        }
      });
    }, (reason: any) => {
      console.error('Error with Storage', reason);
    });
  }

  private checkIntervalStartupData(): void {
    this.storage.get(StorageDefaultData.INITIAL_INTERVAL_ID).then((value: any) => {
      if (!value) {
        this.storage.set(StorageDefaultData.INITIAL_INTERVAL_ID, StorageDefaultData.INTERVAL_DATA);
      }
    });
  }

  private checkTimerStartupData(): void {
    this.storage.get(StorageDefaultData.INITIAL_TIMER_ID).then((value: any) => {
      if (!value) {
        this.storage.set(StorageDefaultData.INITIAL_TIMER_ID, StorageDefaultData.TIMER_DATA);
      }
    });
  }

  private checkStopwatchStartupData(): void {
    this.storage.get(StorageDefaultData.INITIAL_STOPWATCH_ID).then((value: any) => {
      if (!value) {
        this.storage.set(StorageDefaultData.INITIAL_STOPWATCH_ID, StorageDefaultData.STOPWATCH_DATA);
      }
    });
  }

  setItem(data: UUIDData) {
    // checking to see if data's timer info has chanaged. ignoring warnings key and any other fields
    // if timer info has changed, set the 'hasLastSettingChangedTime' field to true.
    this.getItem(data.uuid).then((value: IntervalStorageData | TimerStorageData) => {
      if ((value as IntervalStorageData).activerest) {
        if (((value as IntervalStorageData).activerest.lower !== (data as IntervalStorageData).activerest.lower) ||
          ((value as IntervalStorageData).activerest.upper !== (data as IntervalStorageData).activerest.upper) ||
          ((value as IntervalStorageData).intervals !== (data as IntervalStorageData).intervals) ||
          ((value as IntervalStorageData).countdown !== (data as IntervalStorageData).countdown)) {
          (data as IntervalStorageData).hasLastSettingChangedTime = true;
        } else {
          (data as IntervalStorageData).hasLastSettingChangedTime = false;
        }
      } else if ((value as TimerStorageData).time) {
        (data as TimerStorageData).hasLastSettingChangedTime = ((value as TimerStorageData).time !== (data as TimerStorageData).time);
      }

      this.storage.set(data.uuid, data).then(() => {
        if (data.uuid !== AITStorage.APP_ID) {
          this.setCurrentUUID(data.uuid);
        }
      }, (reason: any) => {
        console.error('Error setting item', reason);
      });
    });
  }

  getItem(uuid: string): Promise<UUIDData> {
    return this.storage.get(uuid).then((value: any) => {
      return value;
    }, (reason: any) => {
      console.error('Error retrieving item', reason);
    });
  }

  setCurrentUUID(uuid: string): void {
    this.getItem(AITStorage.APP_ID).then((value) => {
      if (value.current_uuid !== uuid) {
        value.current_uuid = uuid;
        this.setItem(value);
      }
    }, (reason: any) => {
      console.error('Error storing item', reason);
    });
  }

    getCurrentUUID(): Promise<UUIDData> {
      return this.getItem(AITStorage.APP_ID).then((value: any) => {
        return this.getItem(value.current_uuid);
      }, (reason: any) => {
        console.error('Error retrieving item', reason);
        return undefined;
      });
    }
  */
