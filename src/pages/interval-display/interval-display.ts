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
import { SequenceStates } from '../../providers/SotsUtil';
import { TimeEmission } from 'sots';
import { AITBasePage } from '../AITBasePage';
import { ViewChild } from '@angular/core';
import { ActiverestRendererComponent } from '../../components/activerest-renderer/activerest-renderer';
import { IntervalSettingsPage } from '../interval-settings/interval-settings';

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage extends AITBasePage {
  @ViewChild(ActiverestRendererComponent)
  private activeRestRenderer: ActiverestRendererComponent;

  @Input('data')
  get data(): IntervalStorageData {
    return this._uuidData as IntervalStorageData;
  }
  set data(value: IntervalStorageData) {
    this._uuidData = value;
  }

  protected _remainingIntervalTime: number;
  @Input()
  get remainingIntervalTime() {
    return this._remainingIntervalTime;
  }
  set remainingIntervalTime(value: number) {
    this._remainingIntervalTime = value;
  }

  currentInterval: number;

  ionViewDidEnter() {
    super.ionViewDidEnter();
  }

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

        if (value.interval) {
          this.currentInterval = value.interval.current;
          this.activeRestRenderer.time = Math.ceil(value.time);
        }

        if (value.state) {
          // if we dont negate the audiable states the display will "blink"
          // for a millisecond. so valueNoAudiable will be used to set viewState
          // without any audiable state included.
          let valueNoAudiable: number = (value.state.valueOf() as SequenceStates);
          valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
          this.viewState = valueNoAudiable;
          // console.log(this.activeRestRenderer.time + ': ' + value.state + '<->' + valueNoAudiable);

          // ...now take care of audiable states...
          if (value.state.valueOf(SequenceStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SequenceStates.DoubleBeep)) {
            this.signal.double();
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
        this.aitSetViewInRunningMode(false);
        this.menu.setToCompletedMode();

        this.ngDectector.detectChanges();
      }
    });

    super.aitSubscribeTimer();
  }

  aitCreateSettingsPage() {
    super.aitCreateSettingsPage(IntervalSettingsPage);
  }
}
