import { NativeStorage } from '@ionic-native/native-storage';
import { Injectable } from '@angular/core';

@Injectable()
export class Storage {

  constructor(public nativeStorage: NativeStorage) {

  }

  setItem(data: any) {
    this.nativeStorage.setItem(data.uuid, data).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }

  getItem(uuid: string): Promise<void> {
    return this.nativeStorage.getItem(uuid).then(
      data => console.log(data),
      error => console.error(error)
    );
  }
}
