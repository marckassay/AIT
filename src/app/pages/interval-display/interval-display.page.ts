import { Component, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { TimeEmission } from 'sots';

import { ActiverestRendererComponent } from '../../components/activerest-renderer/activerest-renderer';
import { SequenceStates } from '../../services/sots/ait-sots.util';
import { AITBasePage } from '../ait-base.page';
import { IntervalSettingsPage } from '../interval-settings/interval-settings.page';

@Component({
  selector: 'page-interval-display',
  templateUrl: './interval-display.page.html',
  styleUrls: ['./interval-display.page.scss']
})
export class IntervalDisplayPage extends AITBasePage {
  @ViewChild(ActiverestRendererComponent)
  private activeRestRenderer: ActiverestRendererComponent;

  protected _remainingIntervalTime: number;
  @Input()
  get remainingIntervalTime() {
    return this._remainingIntervalTime;
  }
  set remainingIntervalTime(value: number) {
    this._remainingIntervalTime = value;
  }

  currentInterval: number;

  ngOnInit() {
    this.settingsPageClass = IntervalSettingsPage;

    super.ngOnInit();
  }

  ionViewWillEnter() {
    this.sots.build(this.uuidData.countdown,
      this.uuidData.warnings,
      this.uuidData.intervals,
      this.uuidData.activerest.lower,
      this.uuidData.activerest.upper
    );
    this.grandTime = this.sots.getGrandTime({ time: -1 });
  }

  ionViewDidEnter() {
    this.aitSubscribeTimer();
    super.ionViewDidEnter();
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
          this.timerState = valueNoAudiable;
          // console.log(this.activeRestRenderer.time + ': ' + value.state + '<->' + valueNoAudiable);

          // ...now take care of audiable states...
          if (value.state.valueOf(SequenceStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SequenceStates.DoubleBeep)) {
            this.signal.double();
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
        this.signal.triple();
        this.grandTime = this.sots.getGrandTime({ time: 0 });
        this.setAppToRunningMode(false);
        this.floatingbuttons.setToCompletedMode();
      }
    });
  }
}
