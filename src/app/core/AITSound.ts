import { Howl } from 'howler';

export class AITSound {
  sound_1: Howl;
  constructor() {
    this.sound_1 = new Howl({
      src: ['assets/sounds/beep.mp3']
    });
  }

  singleBeep() {
    this.sound_1.stop();
    this.sound_1.rate(1.0);
    this.sound_1.play();
  }

  tripleBeep() {
    let interval = 0;
    let intervalId = setInterval(() => {
      if (interval === 0 || interval === 2) {
        this.sound_1.stop();
        this.sound_1.rate(1.5);
        this.sound_1.play();
      } else if (interval === 1) {
        this.sound_1.stop();
        this.sound_1.rate(.5);
        this.sound_1.play();
      }
      (interval === 2) ? clearInterval(intervalId) : interval++;
    }, 250);
  }

  completeBeep() {
    let interval = 0;
    let intervalId = setInterval(() => {
      this.sound_1.stop();
      this.sound_1.rate(1);
      this.sound_1.play();
      (interval === 50) ? clearInterval(intervalId) : interval++;
    }, 150);
  }
}
