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
