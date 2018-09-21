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
import { IntervalStorageData, TimerStorageData, UUIDData } from '../app/app.component';

@Injectable()
export class AITStorage {
  public static readonly APP_ID: string = '00000000-0000-0000-0000-000000000001';
  public static readonly INITIAL_INTERVAL_ID: string = '00000000-0000-0000-0000-000000000002';
  public static readonly INITIAL_TIMER_ID: string = '00000000-0000-0000-0000-000000000003';
  public static readonly INITIAL_STOPWATCH_ID: string = '00000000-0000-0000-0000-000000000004';

  constructor(public storage: Storage) {
  }

  public checkAppStartupData(): Promise<void> {

    return this.storage.ready().then(() => {

      this.storage.get(AITStorage.APP_ID).then((value: UUIDData) => {
        if (!value) {
          let data_app = {
            uuid: AITStorage.APP_ID,
            current_uuid: AITStorage.INITIAL_INTERVAL_ID,
            vibrate: true,
            sound: true,
            brightness: undefined,
            base: 0,
            accent: 0
          };

          this.storage.set(AITStorage.APP_ID, data_app).then(() => {
            this.checkIntervalStartupData();
            this.checkTimerStartupData();
            this.checkStopwatchStartupData();
          });
        } else {

        }
      });
    }, () => {
      // console.error('Error with readiness', error)
    });
  }

  private checkIntervalStartupData(): void {
    this.storage.get(AITStorage.INITIAL_INTERVAL_ID).then((value: any) => {
      if (!value) {
        let data_interval = {
          uuid: AITStorage.INITIAL_INTERVAL_ID,
          name: 'Program #1',
          activerest: { lower: 10, upper: 50 },
          activemaxlimit: 90,
          intervals: 12,
          intervalmaxlimit: 20,
          countdown: 10,
          countdownmaxlimit: 60,
          hasLastSettingChangedTime: false,
          warnings: { fivesecond: false, tensecond: true, fifteensecond: false },
        };
        this.storage.set(AITStorage.INITIAL_INTERVAL_ID, data_interval);
      }
    });
  }

  private checkTimerStartupData(): void {
    this.storage.get(AITStorage.INITIAL_TIMER_ID).then((value: any) => {
      if (!value) {
        let data_interval = {
          uuid: AITStorage.INITIAL_TIMER_ID,
          name: 'Program #2',
          countdown: 10,
          countdownmaxlimit: 60,
          time: 900,
          hasLastSettingChangedTime: false,
          warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
        };
        this.storage.set(AITStorage.INITIAL_TIMER_ID, data_interval);
      }
    });
  }

  private checkStopwatchStartupData(): void {
    this.storage.get(AITStorage.INITIAL_STOPWATCH_ID).then((value: any) => {
      if (!value) {
        let data_interval = {
          uuid: AITStorage.INITIAL_STOPWATCH_ID,
          name: 'Program #3',
          countdown: 10,
          countdownmaxlimit: 60,
          hasLastSettingChangedTime: false,
          warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
        };
        this.storage.set(AITStorage.INITIAL_STOPWATCH_ID, data_interval);
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
      }, () => {
        // console.error('Error storing item', error)
      });
    });
  }

  getItem(uuid: string): Promise<UUIDData> {
    return this.storage.get(uuid).then((value: any) => {
      return value;
    }, () => {
      // console.error('Error retrieving item', error)
    });
  }

  setCurrentUUID(uuid: string): void {
    this.getItem(AITStorage.APP_ID).then((value) => {
      if (value.current_uuid !== uuid) {
        value.current_uuid = uuid;
        this.setItem(value);
      }
    }, () => {
      // console.error('Error storing item', error)
    });
  }

  getCurrentUUID(): Promise<UUIDData> {
    return this.getItem(AITStorage.APP_ID).then(
      (value) => {
        return this.getItem(value.current_uuid);
      },
      (reason) => {
        return reason;
      }
    );
  }
}
