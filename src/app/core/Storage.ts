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
