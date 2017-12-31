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

  remainingIntervalTime: number;
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

        if (value.interval) {
          this.currentInterval = value.interval.current;
          this.remainingIntervalTime = Math.ceil(value.time);
        }

        if (value.state) {
          // if we dont negate the audiable states the display will "blink"
          // for a millisecond.
          let valueNoAudiable = (value.state.valueOf() as SequenceStates);
          valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
          this.viewState = valueNoAudiable;

          // ...now take care of audiable states...
          if (value.state.valueOf(SequenceStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SequenceStates.DoubleBeep)) {
            this.signal.double();
          }
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
}
