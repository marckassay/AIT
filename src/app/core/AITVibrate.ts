import { Vibration } from '@ionic-native/vibration';

export class AITVibrate {
  vibration: Vibration;

  constructor(vibration: Vibration) {
    this.vibration = vibration;
  }

  public singleVibrate() {
    this.vibration.vibrate(500);
  }

  public doubleVibrate() {
    this.vibration.vibrate([500, 500, 500]);
  }

  public tripleVibrate() {
    this.vibration.vibrate([1000, 500, 1000]);
  }
}
