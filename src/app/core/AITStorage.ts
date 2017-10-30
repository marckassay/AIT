import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { UUIDData } from '../app.component';

@Injectable()
export class AITStorage {
  public static readonly APP_ID: string               = "00000000-0000-0000-0000-000000000001";
  public static readonly INITIAL_INTERVAL_ID: string  = "00000000-0000-0000-0000-000000000002";

  constructor(public storage: Storage) {
  }

  public checkAppStartupData(): Promise<void> {
    return this.storage.ready().then((value: LocalForage) => {
        this.storage.get(AITStorage.APP_ID).then((value: UUIDData) => {
        if(!value){
          let data_app = {  uuid: AITStorage.APP_ID,
                            current_uuid: AITStorage.INITIAL_INTERVAL_ID,
                            vibrate: true,
                            sound: true,
                            lighttheme: true};
          this.storage.set(AITStorage.APP_ID, data_app).then(()=>{
            this.checkIntervalStartupData();
          });
        } else {
          this.checkIntervalStartupData();
        }
      })
    }, (error: any) => {
      console.error('Error with readiness', error)
    });
  }

  private checkIntervalStartupData(): void {
    this.storage.get(AITStorage.INITIAL_INTERVAL_ID).then((value: any) => {
      if(!value){
        let data_interval = {  uuid: AITStorage.INITIAL_INTERVAL_ID,
                                name: "Program #1",
                                activerest: {lower: 10, upper: 50},
                                activemaxlimit: 90,
                                intervals: 12,
                                intervalmaxlimit: 20,
                                countdown: 10,
                                countdownmaxlimit: 60,
                                getready: 3,
                                warnings: {fivesecond: false, tensecond: true, fifthteensecond: false},
                                isCountdownInSeconds: true };
        this.storage.set(AITStorage.INITIAL_INTERVAL_ID, data_interval);
      }
    });
  }

  setItem(data: UUIDData) {
    this.storage.set(data.uuid, data).then(() => {
      if(data.uuid != AITStorage.APP_ID) {
        this.setCurrentUUID(data.uuid);
      }
    }, (error: any) => {
      console.error('Error storing item', error)
    });
  }

  getItem(uuid: string): Promise<UUIDData> {
    return this.storage.get(uuid).then((value: any) => {
      return value;
    }, (error: any) => {
      console.error('Error retrieving item', error)
    });
  }

  private setCurrentUUID(uuid: string): void {
    this.getItem(AITStorage.APP_ID).then((value) => {
      if(value.current_uuid != uuid) {
        value.current_uuid = uuid;
        this.setItem(value);
      }
    }, (error: any) => {
      console.error('Error storing item', error)
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
