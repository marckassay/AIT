import { NativeStorage } from '@ionic-native/native-storage';
import { Injectable } from '@angular/core';
import { IntervalStorageData } from '../app.component';

@Injectable()
export class Storage {

  constructor(public nativeStorage: NativeStorage) {

  }

  setItem(data: IntervalStorageData) {
    this.nativeStorage.setItem(data.uuid, data).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }

  getItem(uuid: string): Promise<IntervalStorageData> {
    return (this.nativeStorage.getItem(uuid) as Promise<IntervalStorageData>).then((value) => {
      return value;
    });
  }
}

export class StorageMock {
  _data;

  constructor() {
    this._data = {  uuid: "abc123",
                    name: "Program #1 ",
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

  setItem(data: IntervalStorageData) {
    this._data = data;
  }

  getItem(uuid: string): Promise<IntervalStorageData> {
    return Promise.resolve<IntervalStorageData>(this._data);
  }
}
