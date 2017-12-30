import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AITBasePage } from '../AITBasePage';
import { SequenceStates } from '../../app/core/SotsForAit';
import { TimeEmission } from 'sots';
import { TimerStorageData } from '../../app/app.component';

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
        }
      },
      error: (error: any): void => {
        this.viewState = SequenceStates.Error;
        error!;
      },
      complete: (): void => {
        this.viewState = SequenceStates.Completed;
        this.signal.triple();
        this.grandTime = this.sots.getGrandTime();
      }
    });

    super.aitSubscribeTimer();
  }
}
