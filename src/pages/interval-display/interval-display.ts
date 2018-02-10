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
import { IonicPage } from 'ionic-angular';
import { IntervalStorageData } from '../../app/app.component';
import { Component, Input } from '@angular/core';
import { SequenceStates } from '../../app/core/SotsForAit';
import { TimeEmission } from 'sots';
import { AITBasePage } from '../AITBasePage';

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage extends AITBasePage {
  @Input('data')
  get data(): IntervalStorageData {
    return this._uuidData as IntervalStorageData;
  }
  set data(value: IntervalStorageData) {
    this._uuidData = value;
  }

  remainingIntervalTime: string;
  currentInterval: number;

  aitBuildTimer() {
    this.sots.build(this.data.countdown,
      this.data.warnings,
      this.data.intervals,
      this.data.activerest.lower,
      this.data.activerest.upper
    );

    super.aitBuildTimer();
  }

  aitSubscribeTimer(): void {
    this.sots.subscribe({
      next: (value: TimeEmission): void => {
        this.grandTime = this.sots.getGrandTime(value);

        let sideToPad: 'left' | 'right' | '' = '';

        if (value.state) {
          sideToPad = (value.state.valueOf(SequenceStates.Active)) ? 'left' : 'right';
          // if we dont negate the audiable states the display will "blink"
          // for a millisecond.
          let valueNoAudiable: number;
          valueNoAudiable = (value.state.valueOf() as SequenceStates);
          valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
          this.viewState = valueNoAudiable;

          // ...now take care of audiable states...
          if (value.state.valueOf(SequenceStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SequenceStates.DoubleBeep)) {
            this.signal.double();
          }
        }

        if (value.interval) {
          this.currentInterval = value.interval.current;
          this.remainingIntervalTime = this.padSide(value.time, sideToPad);
        }
      },
      error: (error: any): void => {
        this.viewState = SequenceStates.Error;
        error!;
      },
      complete: (): void => {
        this.viewState = SequenceStates.Completed;
        this.signal.triple();
        this.grandTime = this.sots.getGrandTime({ time: 0 });
        this.aitSetViewInRunningMode(false);
      }
    });

    super.aitSubscribeTimer();
  }

  // At the time for coding this padStart doesnt exist yet in polyfill with Ionic
  // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  protected padSide(source: number, sideToPad: 'left' | 'right' | '') {
    const length: number = 2;
    const padString: string = ' ';

    let sourceString = source.toString();
    if (sideToPad !== '') {
      while (sourceString.length < length) {
        if (sideToPad === 'left') {
          sourceString = padString + sourceString;
        } else {
          sourceString = padString + sourceString;
        }
      }
    }
    return sourceString;
  }
}
