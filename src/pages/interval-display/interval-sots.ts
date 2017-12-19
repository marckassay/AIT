import { CountdownSegment, Sequencer, TimeEmission, add } from 'sots';
import { CountdownWarnings } from '../../app/app.component';
import * as moment from 'moment';

export enum SeqStates {
  SingleBeep = 2,
  DoubleBeep = 4,
  Warning = 8,
  Countdown = 16,
  Rest = 32,
  Active = 64,
  Completed = 128,
  Error = 256,
  Loaded = 512,

  CountdownWarning = SeqStates.Countdown + SeqStates.Warning,
  RestWarning = SeqStates.Rest + SeqStates.Warning,
  ActiveWarning = SeqStates.Active + SeqStates.Warning
}

export class IntervalSeq {
  sequencer: Sequencer;
  intervals: number;
  intervalDuration: number;

  constructor() {
    this.sequencer = new Sequencer({ period: 100, compareAsBitwise: true });
  }

  build(countdown: number, intervals: number, rest: number, active: number, warnings: CountdownWarnings) {
    this.intervals = intervals;
    this.intervalDuration = rest + active;

    this.sequencer
      .add(CountdownSegment, {
        duration: this.secToMilli(countdown),
        states: [
          { state: SeqStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
          { state: SeqStates.DoubleBeep, timeAt: countdown.toString() },
          { state: SeqStates.SingleBeep, timeAt: '2,1' }
        ]
      })
      .group(intervals,
      add(CountdownSegment, {
        duration: this.secToMilli(rest),
        omitFirst: true,
        states: [
          { state: SeqStates.Rest, timeLessThanOrEqualTo: rest.toString() },
          { state: SeqStates.Warning, timeLessThanOrEqualTo: '3' },
          { state: SeqStates.DoubleBeep, timeAt: rest.toString() },
          { state: SeqStates.SingleBeep, timeAt: '2,1' }
        ]
      }),
      add(CountdownSegment, {
        duration: this.secToMilli(active),
        states: [
          { state: SeqStates.Active, timeLessThanOrEqualTo: active.toString() },
          { state: SeqStates.Warning, timeLessThanOrEqualTo: '3' },
          { state: SeqStates.DoubleBeep, timeAt: active.toString() },
          { state: SeqStates.SingleBeep, timeAt: this.constructActiveSingleBeepTimes(warnings) }
        ]
      })
      );
  }

  constructActiveSingleBeepTimes(warnings: CountdownWarnings): string {
    let times: string;
    times = (warnings.fifthteensecond) ? '15,' : '';
    times += (warnings.tensecond) ? '10,' : '';
    times += (warnings.fivesecond) ? '5,' : '';
    times += '2,1';
    return times;
  }

  milliToSec(milliseconds: number): string {
    return (milliseconds / 1000).toString();
  }

  secToMilli(seconds: number): number {
    return seconds * 1000;
  }

  calculateRemainingTime(value?: TimeEmission): string {
    let totalTimeRemaining: number;

    if (value && value.interval) {
      const remainingintervals: number = value.interval.total - value.interval.current;
      totalTimeRemaining = value.time + (this.intervalDuration * remainingintervals);
    } else if (value) {
      totalTimeRemaining = value.time;
    } else {
      totalTimeRemaining = this.intervalDuration * this.intervals;
    }

    return moment(totalTimeRemaining * 1000).format('mm:ss.S');
  }
}
