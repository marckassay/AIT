import { Vibration } from '@ionic-native/vibration';
import { AITVibrate } from './AITVibrate';
import { AITSound } from './AITSound';
import { Injectable } from '@angular/core';
import { Storage } from './Storage';
import { AppStorageData } from '../app.component';

@Injectable()
export class AITSignal {
  sound: AITSound;
  vibrate: AITVibrate;
  data: AppStorageData;

  constructor(public vibration: Vibration,
              public storage: Storage) {
    this.storage.getItem(Storage.APP_ID).then((value) => {
      this.data = <AppStorageData>value;
    });
    this.sound = new AITSound();
    this.vibrate = new AITVibrate(vibration);
  }

  single() {
    if(this.data.sound) { this.sound.singleBeep() };
    if(this.data.vibrate) { this.vibrate.singleVibrate() };
  }

  double() {
    if(this.data.sound) { this.sound.tripleBeep() };
    if(this.data.vibrate) { this.vibrate.doubleVibrate() };
  }

  triple() {
    if(this.data.sound) { this.sound.completeBeep() };
    if(this.data.vibrate) { this.vibrate.tripleVibrate() };
  }
}
