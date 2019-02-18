/**
    AIT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

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
import { Component } from '@angular/core';
import { TimeEmission } from 'sots';
import { SequenceStates } from 'src/app/services/sots/ait-sots.util';
import { TimerStorageData } from 'src/app/services/storage/ait-storage.shapes';

import { DisplayPage } from '../display-page';
import { TimerSettingsPage } from '../timer-settings/timer-settings.page';


@Component({
  selector: 'page-timer-display',
  templateUrl: './timer-display.page.html',
  styleUrls: ['./timer-display.page.scss'],
})
export class TimerDisplayPage extends DisplayPage {
  _formattedGrandTime: string;
  get formattedGrandTime(): string {
    if (this.screenSvc.isScreenPortrait()) {
      return this.grandTime.replace(':', ':\r\n').replace('.', '.\r\n');
    } else {
      return this.grandTime;
    }
  }
  set formattedGrandTime(value: string) {
    this._formattedGrandTime = value;
  }

  ngOnInit(): void {
    this.settingsPageClass = TimerSettingsPage;

    super.ngOnInit();
  }

  ionViewWillEnter(): void {
    this.aitBuildTimer(this.uuidData);
  }

  ionViewDidEnter(): void {
    this.aitSubscribeTimer();
    super.ionViewDidEnter();
  }

  aitBuildTimer(timerData: TimerStorageData): void {
    if (this.sots.grandTotalTime !== this.uuidData.time ||
      (this.uuidData as TimerStorageData).warnings !== timerData.warnings
    ) {

      this.sots.build(this.uuidData.countdown,
        this.uuidData.warnings,
        this.uuidData.time
      );

      this.grandTime = this.sots.getGrandTime({ time: -1 });
      this.noRebuild = false;
    } else {
      this.noRebuild = true;
    }
  }

  aitSubscribeTimer(): void {
    if (this.noRebuild === false) {
      this.sots.subscribe({
        next: (value: TimeEmission): void => {

          this.grandTime = this.sots.getGrandTime(value);

          if (value.state) {
            // if we dont negate the audiable states the display will "blink"
            // for a millisecond. so valueNoAudiable will be used to set viewState
            // without any audiable state included.
            let valueNoAudiable = (value.state.valueOf() as SequenceStates);
            valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
            this.timerState = valueNoAudiable;

            // ...now take care of audiable states...
            if (value.state.valueOf(SequenceStates.DoubleBeep)) {
              this.signalSvc.double();
            } else if (value.state.valueOf(SequenceStates.SingleBeep)) {
              this.signalSvc.single();
            }
          }
        },
        error: (error: any): void => {
          this.timerState = SequenceStates.Error;
          this.floatingbuttons.setToCompletedMode();
          throw error;
        },
        complete: (): void => {
          this.timerState = SequenceStates.Completed;
          this.setAppToRunningMode(false);
        }
      });
    }
  }
}
