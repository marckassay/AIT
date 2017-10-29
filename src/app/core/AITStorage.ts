import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { UUIDData } from '../app.component';

@Injectable()
export class AITStorage {
  public static readonly APP_ID: string = "00000000-0000-0000-0000-000000000001";
  public static readonly INITIAL_INTERVAL_ID: string = "b0368478-f958-345d-354e-2ecd48578342";

  constructor(public nativeStorage: Storage) {
    nativeStorage.get(AITStorage.APP_ID).then((value) => {
      console.log("^^^"+value+"^^^");
      if(!value){
        let data_app = {  uuid: AITStorage.APP_ID,
                            vibrate: true,
                            sound: true,
                            lighttheme: true};

        nativeStorage.set(AITStorage.APP_ID, data_app);
      }
    });

    nativeStorage.get(AITStorage.INITIAL_INTERVAL_ID).then((value) => {
      console.log("^#^"+value+"^#^");
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
        nativeStorage.set(AITStorage.INITIAL_INTERVAL_ID, data_interval);
      }
    });
  }

  setItem(data: UUIDData) {
    this.nativeStorage.set(data.uuid, data).then(() => {
      if(data.uuid != AITStorage.APP_ID) {
        this.setLastItem(data.uuid);
      }
    },
      error => console.error('Error storing item', error)
    );
  }

  getItem(uuid: string): Promise<UUIDData> {
    return (this.nativeStorage.get(uuid) as Promise<UUIDData>).then((value) => {
      return value;
    });
  }

  private setLastItem(uuid: string): void {
    this.getItem(AITStorage.APP_ID).then((value) => {
      if(value.current_uuid != uuid) {
        value.current_uuid = uuid;
        this.setItem(value);
      }
    });
  }

  getLastItem(): Promise<UUIDData> {
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

export class StorageMock {
  public static readonly APP_ID: string = AITStorage.APP_ID;
  _data_app;
  _data_interval;

  constructor() {
    this._data_app = {  uuid: "0",
                        vibrate: true,
                        sound: true,
                        lighttheme: true};

    this._data_interval = {  uuid: AITStorage.INITIAL_INTERVAL_ID,
                    name: "Program #1",
                    activerest: {lower: 10, upper: 20},
                    activemaxlimit: 90,
                    intervals: 12,
                    intervalmaxlimit: 20,
                    countdown: 10,
                    countdownmaxlimit: 60,
                    getready: 3,
                    warnings: {fivesecond: true, tensecond: true, fifthteensecond: true},
                    isCountdownInSeconds: true };
  }

  setItem(data: UUIDData) {
    if(data.uuid == AITStorage.APP_ID) {
      this._data_app = data;
    } else {
      this._data_interval = data;
    }
  }

  getItem(uuid: string): Promise<UUIDData> {
    if(uuid == AITStorage.APP_ID) {
      return Promise.resolve(this._data_app);
    } else {
      return Promise.resolve(this._data_interval);
    }
  }

  private setLastItem(uuid: string): void {
  }

  getLastItem(): Promise<UUIDData> {
    return Promise.resolve(this._data_interval);
  }
}
