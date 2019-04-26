/*
    AIT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

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
import * as moment from 'moment';
import { PartialObserver } from 'rxjs';
import { add, CountdownSegment, CountupSegment, ITimeEmission, Sequencer } from 'sots';

import { CountdownWarnings } from '../storage/ait-storage.shapes';

import { ISotsForAit, SequenceStates, SotsUtil } from './ait-sots.util';

export class SotsForAit implements ISotsForAit {
  public sequencer: Sequencer;
  private intervalz: number;
  private rest: number;
  private active: number;
  // this value if calculating minus countdown.  It DOES calculate
  // the rest segment that is omitted via omitFirst
  private grandTotalTime: number | undefined;

  constructor() {
    this.grandTotalTime = undefined;
  }

  /**
   * Calls `unsubscribe()` and then instantiates `Sequencer`. Depending on parameters passed, it will
   * execute defined configurations for: interval, timer, stopwatch modes
   *
   * @param countdown
   * @param warnings
   * @param time
   */
  build(countdown: number, warnings: CountdownWarnings, time?: number): void;
  build(countdown: number, warnings: CountdownWarnings, intervals: number, rest: number, active: number): void;
  build(countdown: number, warnings: CountdownWarnings, timeOrIntervals?: number, rest?: number, active?: number): void {

    // unsubscribe if there is an instance to do so.
    this.unsubscribe();
    this.sequencer = new Sequencer({ period: 100, compareAsBitwise: true });

    // if this assertion is true, its has been called by interval-display...
    if (rest !== undefined && active !== undefined) {
      this.intervalz = timeOrIntervals!;
      this.rest = rest;
      this.active = active;
      this.grandTotalTime = (rest + active) * timeOrIntervals!;

      this.sequencer
        .add(CountdownSegment, {
          duration: SotsUtil.secToMilli(countdown),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: countdown.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        })
        .group(timeOrIntervals!,
          add(CountdownSegment, {
            duration: SotsUtil.secToMilli(rest!),
            omitFirst: true,
            states: [
              { state: SequenceStates.Rest, timeLessThanOrEqualTo: rest!.toString() },
              { state: SequenceStates.Warning, timeLessThanOrEqualTo: '3' },
              { state: SequenceStates.DoubleBeep, timeAt: rest!.toString() },
              { state: SequenceStates.SingleBeep, timeAt: '2,1' }
            ]
          }),
          add(CountdownSegment, {
            duration: SotsUtil.secToMilli(active!),
            states: [
              { state: SequenceStates.Active, timeLessThanOrEqualTo: active!.toString() },
              { state: SequenceStates.Warning, timeLessThanOrEqualTo: '3' },
              { state: SequenceStates.DoubleBeep, timeAt: active!.toString() },
              { state: SequenceStates.SingleBeep, timeAt: SotsUtil.constructIntervalSingleAudiblesTimes(warnings!) }
            ]
          })
        );
      // else if, this is called by timer-display
    } else if (timeOrIntervals !== undefined) {
      this.grandTotalTime = timeOrIntervals;

      this.sequencer
        .add(CountdownSegment, {
          duration: SotsUtil.secToMilli(countdown),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: countdown.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        })
        .add(CountdownSegment, {
          duration: SotsUtil.secToMilli(timeOrIntervals),
          states: [
            { state: SequenceStates.Active, timeLessThanOrEqualTo: timeOrIntervals.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: SotsUtil.constructModDoubleAudiblesTimes(warnings) },
            { state: SequenceStates.SingleBeep, timeAt: SotsUtil.constructModSingleAudiblesTimes(warnings, '2,1') }
          ]
        });
      // else, this is called by stopwatch-display
    } else {
      this.grandTotalTime = 0;
      this.sequencer
        .add(CountdownSegment, {
          duration: SotsUtil.secToMilli(countdown),
          states: [
            { state: SequenceStates.CountdownWarning, timeLessThanOrEqualTo: countdown.toString() },
            { state: SequenceStates.DoubleBeep, timeAt: countdown.toString() },
            { state: SequenceStates.SingleBeep, timeAt: '2,1' }
          ]
        })
        .add(CountupSegment, {
          duration: Number.MAX_SAFE_INTEGER,
          states: [
            { state: SequenceStates.Active, timeGreaterThanOrEqualTo: '0' },
            { state: SequenceStates.DoubleBeep, timeAt: SotsUtil.constructModDoubleAudiblesTimes(warnings) },
            { state: SequenceStates.SingleBeep, timeAt: SotsUtil.constructModSingleAudiblesTimes(warnings) }
          ]
        });
    }
  }

  subscribe(observer: PartialObserver<ITimeEmission>): void {
    this.unsubscribe();
    this.sequencer.subscribe(observer);
  }

  unsubscribe(): void {
    if (this.sequencer && this.sequencer.subscription) {
      this.sequencer.unsubscribe();
    }
  }

  getGrandTime(value?: ITimeEmission): string {
    if (value) {
      let totalTimeRemaining: number;

      if (value.interval) {
        // * note: the first interval will not have a rest segment.
        const remainingIntervals: number = value.interval.total - value.interval.current;
        const remainingSecondsOfWholeIntervals: number = (this.rest + this.active) * remainingIntervals;
        const remainingSecondsOfWholeIntervalsMinusFirstRest: number = remainingSecondsOfWholeIntervals;

        if (value.state!.valueOf(SequenceStates.Rest)) {
          totalTimeRemaining = remainingSecondsOfWholeIntervalsMinusFirstRest + this.active + value.time;
        } else {
          totalTimeRemaining = remainingSecondsOfWholeIntervalsMinusFirstRest + value.time;
        }
      } else if (value.time > 0) {
        totalTimeRemaining = value.time;
      } else if (value.time === -1) {
        totalTimeRemaining = this.grandTotalTime;
      } else { // else if (value.time === 0)
        return '00:00.0';
      }

      // format the time with moment
      return moment(totalTimeRemaining * 1000).format('mm:ss.S');

    } else {
      return (this.grandTotalTime !== undefined) ? moment(this.grandTotalTime * 1000).format('mm:ss.S') : '-1';
    }
  }
}
