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
import { Component, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { TimeEmission } from 'sots';

import { ActiverestRendererComponent } from '../../components/activerest-renderer/activerest-renderer';
import { SequenceStates } from '../../services/sots/ait-sots.util';
import { DisplayPage } from '../display-page';
import { IntervalSettingsPage } from '../interval-settings/interval-settings.page';

@Component({
  selector: 'page-interval-display',
  templateUrl: './interval-display.page.html',
  styleUrls: ['./interval-display.page.scss']
})
export class IntervalDisplayPage extends DisplayPage {
  @ViewChild(ActiverestRendererComponent)
  private activeRestRenderer: ActiverestRendererComponent;

  protected _remainingIntervalTime: number;

  @Input()
  get remainingIntervalTime(): number {
    return this._remainingIntervalTime;
  }
  set remainingIntervalTime(value: number) {
    this._remainingIntervalTime = value;
  }

  currentInterval: number;

  ngOnInit(): void {
    this.settingsPageClass = IntervalSettingsPage;

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
    if (this.sots.rest !== this.uuidData.activerest.lower ||
      this.sots.active !== this.uuidData.activerest.upper ||
      this.sots.intervals !== this.uuidData.intervals) {

      this.unsubscribe();

      this.sots.build(this.uuidData.countdown,
        this.uuidData.warnings,
        this.uuidData.intervals,
        this.uuidData.activerest.lower,
        this.uuidData.activerest.upper
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

          if (value.interval) {
            this.currentInterval = value.interval.current;
            this.activeRestRenderer.time = Math.ceil(value.time);
          }

          if (value.state) {
            // if we dont negate the audiable states the display will "blink"
            // for a millisecond. so valueNoAudiable will be used to set viewState
            // without any audiable state included.
            let valueNoAudiable: number = (value.state.valueOf() as SequenceStates);
            // tslint:disable-next-line:no-bitwise
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
