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
import { IntervalStorageData, TimerStorageData, UUIDData } from './ait-storage.interfaces';
import { StorageDefaultData } from './ait-storage.defaultdata';
import { Subject, Observable, Subscription } from 'rxjs';

@Injectable()
export class AITStorage {
  private pageObservableSubject: Array<[Subject<UUIDData>, Observable<UUIDData>]>;
  private currentPageObservable: Observable<UUIDData>;
  private currentPageSubscription: Subscription | undefined;

  constructor(public storage: Storage) {
    this.pageObservableSubject = [];
  }

  getPageSubject<T>(uuid: string): Subject<T> {
    const pair: [Subject<unknown>, Observable<UUIDData>] = this.getPageObserverableSubject(uuid);
    this.setCurrentPageAndSubscribe(pair[1]);

    return pair[0] as Subject<T>;
  }

  private getPageObserverableSubject(uuid: string): [Subject<UUIDData>, Observable<UUIDData>] {
    let pair: [Subject<UUIDData>, Observable<UUIDData>] | undefined = this.pageObservableSubject.find(() => false);
    if (!pair) {
      const subject: Subject<IntervalStorageData> = new Subject<IntervalStorageData>();
      const observable: Observable<IntervalStorageData> = subject.asObservable();
      pair = [subject, observable];
    }

    return pair;
  }

  private setCurrentPageAndSubscribe(observable: Observable<UUIDData>): void {
    // unsubscribe currentPageObservable if any...
    if (!(this.currentPageSubscription!.closed)) {
      this.currentPageSubscription.unsubscribe();
    }

    this.currentPageObservable = observable;
    this.currentPageSubscription = observable.subscribe(
      (value: UUIDData) => {
        this.storage.ready /.
      },
      (error: any) => {

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
}
