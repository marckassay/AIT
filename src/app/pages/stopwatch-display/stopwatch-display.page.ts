/**
    AiT - Another Interval Timer
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

import { DisplayPage } from '../display-page';
import { StopwatchSettingsPage } from '../stopwatch-settings/stopwatch-settings.page';


@Component({
  selector: 'page-stopwatch-display',
  templateUrl: './stopwatch-display.page.html',
  styleUrls: ['./stopwatch-display.page.scss'],
})
export class StopwatchDisplayPage extends DisplayPage {
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
    this.settingsPageClass = StopwatchSettingsPage;

    super.ngOnInit();
  }

  ionViewWillEnter(): void {
    this.aitBuildTimer();
  }

  ionViewDidEnter(): void {
    this.aitSubscribeTimer();
    super.ionViewDidEnter();
  }

  aitBuildTimer(): void {
    this.sots.build(this.uuidData.countdown,
      this.uuidData.warnings);

    this.grandTime = this.sots.getGrandTime({ time: -1 });
    this.noRebuild = false;
  }

  aitSubscribeTimer(): void {
    if (this.noRebuild === false) {
      this.sots.subscribe({
        next: (value: TimeEmission): void => {

          this.grandTime = this.sots.getGrandTime(value);

          if (value.state) {
            // if we dont negate the audiable states the display will "blink"
            // for a millisecond.
            let valueNoAudiable = (value.state.valueOf() as SequenceStates);
            valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
            this.timerState = valueNoAudiable;

            // ...now take care of audiable states...
            if (value.state.valueOf(SequenceStates.SingleBeep)) {
              this.signalSvc.single();
            } else if (value.state.valueOf(SequenceStates.DoubleBeep)) {
              this.signalSvc.double();
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
