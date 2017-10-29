import { Vibration } from '@ionic-native/vibration';
import { AITVibrate } from './AITVibrate';
import { AITSound } from './AITSound';
import { Injectable } from '@angular/core';

@Injectable()
export class AITSignal {
  sound: AITSound;
  vibrate: AITVibrate;

  constructor(public vibration: Vibration) {
    this.sound = new AITSound();
    this.vibrate = new AITVibrate(vibration);
  }

  single() {
    this.sound.singleBeep();
    this.vibrate.singleVibrate();
  }

  double() {
    this.sound.tripleBeep();
    this.vibrate.doubleVibrate();
  }

  triple() {
    this.sound.completeBeep();
    this.vibrate.tripleVibrate();
  }
}
