import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { AITBasePage } from '../AITBasePage';
import { SequenceStates } from '../../app/core/SotsForAit';
import { TimeEmission } from 'sots';
import { StopwatchStorageData } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-stopwatch-display',
  templateUrl: 'stopwatch-display.html',
})
export class StopwatchDisplayPage extends AITBasePage {
  @Input('data')
  get data(): StopwatchStorageData {
    return this._uuidData as StopwatchStorageData;
  }
  set data(value: StopwatchStorageData) {
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
    this.sots.build(this.data.countdown, this.data.warnings);

    super.aitBuildTimer();
  }

  aitSubscribeTimer(): void {
    this.sots.subscribe({
      next: (value: TimeEmission): void => {
        this.grandTime = this.sots.getGrandTime(value);
        if (value.state) {
          // if we dont negate the audiable states the display will "blink"
          // for a tenth of a second.
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
      }
    });

    // this.grandTime = this.sots.getGrandTime({ time: -1 });

    super.aitSubscribeTimer();
  }
}
