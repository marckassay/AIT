import { Howl } from 'howler';

export class AITSoundboard {
  static sound_1 = new Howl({
    src: ['assets/sounds/Speech Off.wav']
  });

  static sound_2 = new Howl({
    src: ['assets/sounds/Speech On.wav']
  });

  static ShortBeep = () => {
    AITSoundboard.sound_1.play();
  };

  static LongBeep = () => {
    AITSoundboard.sound_2.play();
  };

  static CompleteSound = () => {
    AITSoundboard.sound_2.play();
  };
}
