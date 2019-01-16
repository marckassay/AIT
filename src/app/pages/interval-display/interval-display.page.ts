/* import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interval-display',
  templateUrl: './interval-display.page.html',
  styleUrls: ['./interval-display.page.scss'],
})
export class IntervalDisplayPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
 */
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
import { ViewChild } from '@angular/core';
import { TimeEmission } from 'sots';

import { ActiverestRendererComponent } from '../../components/activerest-renderer/activerest-renderer';
import { SequenceStates } from '../../providers/sots/ait-sots.util';
import { IntervalStorageData, UUIDData } from '../../providers/storage/ait-storage.interfaces';
import { AITBasePage } from '../ait-base.page';
// import { IntervalSettingsPageModule } from '../interval-settings/interval-settings.module';

@Component({
  selector: 'app-interval-display',
  templateUrl: './interval-display.page.html',
  styleUrls: ['./interval-display.page.scss']
})
export class IntervalDisplayPage extends AITBasePage {
  @ViewChild(ActiverestRendererComponent)
  private activeRestRenderer: ActiverestRendererComponent;

  @Input()
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

  aitPreBuildTimerCheck(value: UUIDData): boolean {
    const val = value as IntervalStorageData;
    if ((!this.data) ||
      (val.activerest.lower !== this.data.activerest.lower) ||
      (val.activerest.upper !== this.data.activerest.upper) ||
      (val.intervals !== this.data.intervals)) {
      return true;
    } else if ((this.viewState === SequenceStates.Loaded) &&
      (val.countdown !== this.data.countdown)) {
      return true;
    } else {
      return false;
    }
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
          // tslint:disable-next-line:no-bitwise
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

        this.floatingbuttons.setToCompletedMode();

        this.ngDectector.detectChanges();

        throw error;
      },
      complete: (): void => {
        this.viewState = SequenceStates.Completed;
        this.signal.triple();
        this.grandTime = this.sots.getGrandTime({ time: 0 });
        this.setViewInRunningMode(false);
        this.floatingbuttons.setToCompletedMode();

        this.ngDectector.detectChanges();
      }
    });
  }

  createSettingsPage() {
    // super.createSettingsPage(IntervalSettingsPage);
  }
}
