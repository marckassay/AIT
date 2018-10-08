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
import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AITBasePage } from '../ait-base.page';
import { SequenceStates } from '../../providers/sots/ait-sots.util';
import { TimeEmission } from 'sots';
import { TimerStorageData } from '../../providers/storage/ait-storage.interfaces';
import { TimerSettingsPage } from '../timer-settings/timer-settings';

@IonicPage()
@Component({
  selector: 'page-timer-display',
  templateUrl: 'timer-display.html',
})
export class TimerDisplayPage extends AITBasePage {
  @Input('data')
  get data(): TimerStorageData {
    return this._uuidData as TimerStorageData;
  }
  set data(value: TimerStorageData) {
    this._uuidData = value;
  }
  _formattedGrandTime: string;
  get formattedGrandTime(): string {
    if (this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY) {
      return this.grandTime.replace(':', ':\r\n').replace('.', '.\r\n');
    } else {
      return this.grandTime;
    }
  }
  set formattedGrandTime(value: string) {
    this._formattedGrandTime = value;
  }

  aitBuildTimer() {
    this.sots.build(this.data.countdown,
      this.data.warnings,
      this.data.time);

    super.aitBuildTimer();
  }

  aitSubscribeTimer(): void {
    this.sots.subscribe({
      next: (value: TimeEmission): void => {
        this.grandTime = this.sots.getGrandTime(value);

        if (value.state) {
          // if we dont negate the audiable states the display will "blink"
          // for a millisecond.
          let valueNoAudiable = (value.state.valueOf() as SequenceStates);
          valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
          this.viewState = valueNoAudiable;

          // ...now take care of audiable states...
          if (value.state.valueOf(SequenceStates.DoubleBeep)) {
            this.signal.double();
          } else if (value.state.valueOf(SequenceStates.SingleBeep)) {
            this.signal.single();
          }

          this.ngDectector.detectChanges();
        }
      },
      error: (error: any): void => {
        this.viewState = SequenceStates.Error;

        this.menu.setToCompletedMode();

        this.ngDectector.detectChanges();

        throw error;
      },
      complete: (): void => {
        this.viewState = SequenceStates.Completed;
        this.signal.triple();
        this.grandTime = this.sots.getGrandTime({ time: 0 });
        this.setViewInRunningMode(false);
        this.menu.setToCompletedMode();

        this.ngDectector.detectChanges();
      }
    });

    super.aitSubscribeTimer();
  }

  createSettingsPage() {
    super.createSettingsPage(TimerSettingsPage);
  }
}
