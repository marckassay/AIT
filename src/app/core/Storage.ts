import { NativeStorage } from '@ionic-native/native-storage';
import { Injectable } from '@angular/core';
import { IntervalStorageData, UUIDData } from '../app.component';

@Injectable()
export class Storage {
  public static readonly APP_ID: string = "0";

  constructor(public nativeStorage: NativeStorage) {

  }

  setItem(data: UUIDData) {
    this.nativeStorage.setItem(data.uuid, data).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }

  getItem(uuid: string): Promise<UUIDData> {
    return (this.nativeStorage.getItem(uuid) as Promise<UUIDData>).then((value) => {
      return value;
    });
  }
}

export class StorageMock {
  _data_app;
  _data_interval;

  constructor() {
    this._data_app = {  uuid: "0",
                        vibrate: true,
                        sound: true,
                        lighttheme: true};

    this._data_interval = {  uuid: "abc123",
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
    if(data.uuid == Storage.APP_ID) {
      this._data_app = data;
    } else {
      this._data_interval = data;
    }
  }

  getItem(uuid: string): Promise<UUIDData> {
    if(uuid == Storage.APP_ID) {
      return Promise.resolve(this._data_app);
    } else {
      return Promise.resolve(this._data_interval);
    }
  }
}
