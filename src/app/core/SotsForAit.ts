import { CountdownSegment, CountupSegment, Sequencer, TimeEmission, add } from 'sots';
import { CountdownWarnings } from '../app.component';
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

  build(countdown: number, warnings: CountdownWarnings): void;
  build(countdown: number, warnings: CountdownWarnings, time: number): void;
  build(countdown: number, warnings: CountdownWarnings, intervals: number, rest: number, active: number): void;
}

export class SotsForAit implements ISotsForAit {
  sequencer: Sequencer;
  intervals: number;
  intervalDuration: number;
  timerDuration: number;

  constructor() {
    this.sequencer = new Sequencer({ period: 100, compareAsBitwise: true });
  }

  build(countdown: number, warnings: CountdownWarnings): void;
  build(countdown: number, warnings: CountdownWarnings, time: number): void;
  build(countdown: number, warnings: CountdownWarnings, intervals: number, rest: number, active: number): void;
  build(countdown: number, warnings: CountdownWarnings, timeOrIntervals?: number, rest?: number, active?: number): void {
    // if so, called by interval-display...
    if (rest !== undefined && active !== undefined) {
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
            { state: SequenceStates.SingleBeep, timeAt: this.constructIntervalSingleAudiblesTimes(warnings!) }
          ]
        })
        );
      // else if, this is called by timer-display
    } else if (timeOrIntervals !== undefined) {
      this.timerDuration = timeOrIntervals;
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
            { state: SequenceStates.Active, timeLessThanOrEqualTo: timeOrIntervals.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: this.constructModDoubleAudiblesTimes(warnings, timeOrIntervals.toString()) },
            { state: SequenceStates.SingleBeep, timeAt: this.constructModSingleAudiblesTimes(warnings, '2,1') }
          ]
        });
      // else, this is called by stopwatch-display
    } else {
      this.sequencer
        .add(CountdownSegment, {
          duration: this.secToMilli(countdown),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: countdown.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        })
        .add(CountupSegment, {
          duration: this.secToMilli(Number.MAX_SAFE_INTEGER),
          states: [
            { state: SequenceStates.Active, timeGreaterThanOrEqualTo: '0' },
            { state: SequenceStates.DoubleBeep, timeAt: '0' }/*,
            { state: SequenceStates.DoubleBeep, timeAt: this.constructModDoubleAudiblesTimes(warnings, '0') },
            { state: SequenceStates.SingleBeep, timeAt: this.constructModSingleAudiblesTimes(warnings) } */
          ]
        });
    }
  }

  subscribe(observer: PartialObserver<TimeEmission>): void {
    this.sequencer.subscribe(observer);
  }

  constructIntervalSingleAudiblesTimes(warnings: CountdownWarnings): string {
    let times: string;
    times = (warnings.fifthteensecond) ? '15,' : '';
    times += (warnings.tensecond) ? '10,' : '';
    times += (warnings.fivesecond) ? '5,' : '';
    times += '2,1';
    return times;
  }

  constructModSingleAudiblesTimes(warnings: CountdownWarnings, append: string = ''): string {
    let times: string = '';
    if (append.length > 0) {
      times = append + ',';
    }
    times += (warnings.fivesecond) ? 'mod15,' : '';
    times += (warnings.tensecond) ? 'mod30,' : '';
    if (times.endsWith(',')) {
      times = times.slice(0, -1);
    }

    return times;
  }

  constructModDoubleAudiblesTimes(warnings: CountdownWarnings, append: string = ''): string {
    let times: string = '';
    if (append.length > 0) {
      times = append + ',';
    }
    times += (warnings.fifthteensecond) ? 'mod60' : '';
    if (times.endsWith(',')) {
      times = times.slice(0, -1);
    }

    return times;
  }

  milliToSec(milliseconds: number): string {
    return (milliseconds / 1000).toString();
  }

  secToMilli(seconds: number): number {
    return seconds * 1000;
  }

  getGrandTime(value?: TimeEmission): string {
    let totalTimeRemaining: number;

    if (value && value.interval) {
      const remainingintervals: number = value.interval.total - value.interval.current;
      totalTimeRemaining = value.time + (this.intervalDuration * remainingintervals);
      // if this is defined and the above isnt, we are in running mode for non-intervals or countdown
    } else if (value) {
      totalTimeRemaining = value.time;
      // if intervalDuration is defined, then we are in interval-display
    } else if (this.intervalDuration) {
      totalTimeRemaining = this.intervalDuration * this.intervals;
    } else if (this.timerDuration) {
      totalTimeRemaining = this.timerDuration;
    } else {
      return '00:00.0';
    }

    return moment(totalTimeRemaining * 1000).format('mm:ss.S');
  }
}
