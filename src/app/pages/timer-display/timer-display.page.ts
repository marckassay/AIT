import { Component } from '@angular/core';
import { TimeEmission } from 'sots';
import { SequenceStates } from 'src/app/services/sots/ait-sots.util';

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
    if (this.screenSvc.orientation.type === this.screenSvc.orientation.ORIENTATIONS.PORTRAIT) {
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
    this.aitBuildTimer();
  }

  ionViewDidEnter(): void {
    this.aitSubscribeTimer();
    super.ionViewDidEnter();
  }

  aitBuildTimer(): void {
    if (this.sots.grandTotalTime !== this.uuidData.time) {
      this.sots.build(this.uuidData.countdown,
        this.uuidData.warnings,
        this.uuidData.time);

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
            // for a millisecond.
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
          this.signalSvc.completed();
          this.grandTime = this.sots.getGrandTime({ time: -1 });
          this.setAppToRunningMode(false);
          this.floatingbuttons.setToCompletedMode();
        }
      });
    }
  }
}
