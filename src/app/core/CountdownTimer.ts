import { Observable, Subscription, AnonymousSubject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { EventEmitter } from '@angular/core';
import { ITimelinePosition } from '../app.component';

export enum CountdownState {
  Loaded    = 1,
  GetReady  = 2,
  Active    = 4,
  Completed = 16,
  Error     = 32,
  Start     = 64,
  Instant   = 128,

  ActiveStart = Active + Start + Instant,
  ActiveStopWarning = Active + GetReady,
  ActiveStopWarningOnTheSecond = ActiveStopWarning + Instant
}

export interface ICountdownEmission
{
  timelinePosition: number;
  state: CountdownState;
  remainingTime: string;
}

export class CountdownTimer
{
  source: Observable<ITimelinePosition>;

  publication: Observable<any>;

  state: CountdownState;

  millisecond: number = 1000;
  precision: number = 10; // one-tenth

  totalTimeInSeconds: number;
  totalTimeInSecondsISO:string;

  modulusOffsetInSeconds:number;

  timelinePosition: number = 0;
  timelineMaxLimit: number;

  constructor(private time: number, private getReady: number, private timeInUnitsOfSeconds: boolean) {
    this.initializeTimer();
  }

  initializeTimer(): void {
    this.state = CountdownState.Loaded;

    // convert minutes to seconds if needed...
    if(!this.timeInUnitsOfSeconds) {
      this.time *= 60;
    }
    this.totalTimeInSeconds = this.time;
    this.totalTimeInSecondsISO = this.getRemainingTimeISO( this.totalTimeInSeconds * this.millisecond );
    this.timelineMaxLimit = this.totalTimeInSeconds * this.precision;// precision being used as a factor here...
    this.modulusOffsetInSeconds = this.totalTimeInSeconds - this.getReady;

    this.source = Observable.timer(0, this.millisecond/this.precision)
                            .map( (x) => this.countdown(x) )
                            .takeWhile((x: ITimelinePosition) => {return x.timelinePosition < this.timelineMaxLimit});
  }

  countdown(x: any): ICountdownEmission {
    let remainingTimeInSeconds: number = +((this.totalTimeInSeconds - (this.timelinePosition/this.precision)).toFixed(1));
    let remainingTimeISO:string = this.getRemainingTimeISO( remainingTimeInSeconds * this.millisecond );

    // strip away Start and/or Instant states if needed...those are momentary "sub" states
    if (this.state & CountdownState.Start) {
      this.state -= CountdownState.Start;
    }
    if (this.state & CountdownState.Instant) {
      this.state -= CountdownState.Instant;
    }

    // is it the very start or end...
    if(remainingTimeInSeconds == this.totalTimeInSeconds) {
      this.state = CountdownState.ActiveStart;
    }
    else if(remainingTimeInSeconds == 0) {
      this.state = CountdownState.Completed;
    }
    // is it time to enter into Warning/GetReady states...
    else if ( remainingTimeInSeconds == this.getReady ) {
      this.state = CountdownState.ActiveStopWarningOnTheSecond;
    }
    // if currently in warning state and on a whole second (not being the first second of this warning)...
    else if( (this.state & CountdownState.GetReady) == CountdownState.GetReady &&
        ( (this.state & CountdownState.ActiveStopWarningOnTheSecond) != CountdownState.ActiveStopWarningOnTheSecond )  &&
        (remainingTimeISO.split('.')[1] == '0')
    ) {
      // by adding this, it will construct an xWarningOnTheSecond state...
      this.state += CountdownState.Instant;
    }

    return { timelinePosition: this.timelinePosition++,
             state: this.state,
             remainingTime: remainingTimeISO };
  }

  getRemainingTimeISO (remainingmilliseconds: number): string {
    let s = new Date(remainingmilliseconds);
    // returns this partial time segment: 01:02.3
    return s.toISOString().substr(14,7);
  }
}
