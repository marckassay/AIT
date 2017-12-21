import { CountdownSegment, Sequencer, TimeEmission, add } from 'sots';
import { CountdownWarnings } from '../app/app.component';
import * as moment from 'moment';
import { PartialObserver } from 'rxjs/Observer';

export enum SequenceStates {
  SingleBeep = 2,
  DoubleBeep = 4,
  Warning = 8,
  Countdown = 16,
  Rest = 32,
  Active = 64,
  Completed = 128,
  Error = 256,
  Loaded = 512,

  CountdownWarning = SequenceStates.Countdown + SequenceStates.Warning,
  RestWarning = SequenceStates.Rest + SequenceStates.Warning,
  ActiveWarning = SequenceStates.Active + SequenceStates.Warning
}

export interface ISotsForAit {
  sequencer: Sequencer;
  build(countdown: number, time: number): void;
  build(countdown: number, intervals: number, rest: number, active: number, warnings: CountdownWarnings): void;
}

export class SotsForAit implements ISotsForAit {
  sequencer: Sequencer;
  intervals: number;
  intervalDuration: number;

  constructor() {
    this.sequencer = new Sequencer({ period: 100, compareAsBitwise: true });
  }

  build(countdown: number, time: number): void;
  build(countdown: number, intervals: number, rest: number, active: number, warnings: CountdownWarnings): void;
  build(countdown: number, timeOrIntervals: number, rest?: number, active?: number, warnings?: CountdownWarnings): void {
    if (warnings === undefined) {
      this.sequencer
        .add(CountdownSegment, {
          duration: this.secToMilli(countdown),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: countdown.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        })
        .add(CountdownSegment, {
          duration: this.secToMilli(timeOrIntervals),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: '60' },
            { state: SequenceStates.DoubleBeep, timeAt: '60' },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        });
    } else if (warnings !== undefined) {
      this.intervals = timeOrIntervals!;
      this.intervalDuration = rest! + active!;

      this.sequencer
        .add(CountdownSegment, {
          duration: this.secToMilli(countdown),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: countdown.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        })
        .group(timeOrIntervals!,
        add(CountdownSegment, {
          duration: this.secToMilli(rest!),
          omitFirst: true,
          states: [
            { state: SequenceStates.Rest, timeLessThanOrEqualTo: rest!.toString() },
            { state: SequenceStates.Warning, timeLessThanOrEqualTo: '3' },
            { state: SequenceStates.DoubleBeep, timeAt: rest!.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        }),
        add(CountdownSegment, {
          duration: this.secToMilli(active!),
          states: [
            { state: SequenceStates.Active, timeLessThanOrEqualTo: active!.toString() },
            { state: SequenceStates.Warning, timeLessThanOrEqualTo: '3' },
            { state: SequenceStates.DoubleBeep, timeAt: active!.toString() },
            { state: SequenceStates.SingleBeep, timeAt: this.constructActiveSingleBeepTimes(warnings) }
          ]
        })
        );
    }
  }

  subscribe(observer: PartialObserver<TimeEmission>): void {
    this.sequencer.subscribe(observer);
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

  getTime(value?: TimeEmission): string {
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
