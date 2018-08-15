/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Howl } from 'howler';

export class AITSound {
  sound_1: Howl;
  volume: number;
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
