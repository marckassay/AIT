import { Howl } from 'howler';

export class AITSoundboard {
  static sound_1 = new Howl({
    src: ['assets/sounds/beep.mp3']
  });

  static ShortBeep = () => {
    AITSoundboard.sound_1.stop();
    AITSoundboard.sound_1.rate(1.0);
    AITSoundboard.sound_1.play();
  };

  static DoubleBeep = () => {
    let interval = 0;
    let intervalId = setInterval(() => {
      if(interval === 0 || interval === 2){
        AITSoundboard.sound_1.stop();
        AITSoundboard.sound_1.rate(1.5);
        AITSoundboard.sound_1.play();
      }
      else if (interval == 1) {
        AITSoundboard.sound_1.stop();
        AITSoundboard.sound_1.rate(.5);
        AITSoundboard.sound_1.play();
      }
      (interval === 2)? clearInterval(intervalId):interval++;
    },150);
  };

  static LongBeep = () => {
    AITSoundboard.sound_1.stop();
    AITSoundboard.sound_1.rate(1.0);
    AITSoundboard.sound_1.loop(true);
    AITSoundboard.sound_1.volume(1.0);
    AITSoundboard.sound_1.fade(1,0,1000);
    AITSoundboard.sound_1.play();
  };

  static CompleteSound = () => {
    AITSoundboard.sound_1.play();
  };
}
