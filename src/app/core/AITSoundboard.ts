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

  static TripleBeep = () => {
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

  static CompleteSound = () => {
    AITSoundboard.sound_1.play();
  };
}
