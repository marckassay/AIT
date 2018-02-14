import { Sequencer } from 'sots';
import { CountdownWarnings } from '../app.component';

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

export class SotsUtil {

  static constructIntervalSingleAudiblesTimes(warnings: CountdownWarnings): string {
    let times: string;
    times = (warnings.fifthteensecond) ? '15,' : '';
    times += (warnings.tensecond) ? '10,' : '';
    times += (warnings.fivesecond) ? '5,' : '';
    times += '2,1';
    return times;
  }

  static constructModSingleAudiblesTimes(warnings: CountdownWarnings, append: string = ''): string {
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

  static constructModDoubleAudiblesTimes(warnings: CountdownWarnings, append: string = ''): string {
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

  static milliToSec(milliseconds: number): string {
    return (milliseconds / 1000).toString();
  }

  static secToMilli(seconds: number): number {
    return seconds * 1000;
  }
}
