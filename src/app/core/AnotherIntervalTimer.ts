import { Observable, Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { EventEmitter } from '@angular/core';

export enum IntervalState {
  Loaded    = 1,
  GetReady  = 2,
  Active    = 4,
  Rest      = 8,
  Completed = 16,
  Error     = 32,
  Start     = 64,
  Instant   = 128,

  ActiveStart = Active + Start + Instant,
  ActiveStopWarning = Active + GetReady,
  ActiveStopWarningOnTheSecond = ActiveStopWarning + Instant,

  RestStart = Rest + Start + Instant,
  RestStopWarning = Rest + GetReady,
  RestStopWarningOnTheSecond = RestStopWarning + Instant,
}

export interface IIntervalEmission {
	 state: IntervalState;
   remainingTime: string;
   remainingIntervalTime: number;
	 currentInterval: number;
}

export class AnotherIntervalTimer {
  source: Observable<IIntervalEmission>;
  pauser: EventEmitter<boolean>;// = new Subject();//Observable<boolean>;
  subscription: Observable<any>;

  totalTimeISO:string;

  millisecond: number = 1000;
  precision: number = 10; // one-tenth

  intervalTime: number;
  totalTime: number;
  totalmilliseconds: number;

  currentInterval: number;
  modulusOffset: number;
  state: IntervalState;
  remainingIntervalTime: number;
  timelinePosition: number = 0;

  constructor(private activeTime:number, private restTime:number, private intervals:number, private getReady:number=3) {
    this.intervalTime = activeTime + restTime;
    this.totalTime = this.intervalTime * this.intervals;
    this.totalmilliseconds = this.totalTime * this.millisecond;

    this.initializeTimer();
  }

  initializeTimer(): void {
    this.currentInterval = this.intervals;

    this.totalTimeISO = this.getRemainingTimeISO(0);
    // making 'source' local with type 'any' so that it can be used in the switchMap without type issues...
    this.source = Observable.timer(0, this.millisecond/this.precision).map((x) => this.interval(x));

    this.pauser = new EventEmitter<boolean>(true);//.startWith(false);;//Observable<boolean>();

    this.subscription = (this.pauser as Observable<boolean>).switchMap((paused) => (paused) ? Observable.never() : this.source)
              .take(this.totalTime*this.precision);//precision acting as a factor here
  }

  interval(x): IIntervalEmission {
    let remainingTime = this.totalTime - (this.timelinePosition/this.precision);
    let remainingmilliseconds: number = remainingTime * this.millisecond;
    this.modulusOffset = this.currentInterval * this.restTime;

    // strip away Start and/or Instant states if needed...those are momentary "sub" states
    if (this.state & IntervalState.Start) {
      this.state -= IntervalState.Start;
    }
    if (this.state & IntervalState.Instant) {
      this.state -= IntervalState.Instant;
    }

    // is it time to enter into Rest (and also check if we are Completed before changing to Rest)...
    if(remainingTime % this.intervalTime == 0) {
      if(remainingTime == 0) {
        this.state = IntervalState.Completed;
      } else {
        this.currentInterval--;
        this.state = IntervalState.RestStart;
        this.remainingIntervalTime = this.restTime;
      }
    }
    // is it time to enter into Warning states...(interesting that this 'else if' works for both warning states)
    else if ( ((remainingTime - this.modulusOffset - this.getReady) % this.activeTime) == 0 ) {
      if(this.state & IntervalState.Rest) {
        this.state = IntervalState.RestStopWarningOnTheSecond;
      } else if(this.state & IntervalState.Active) {
        this.state = IntervalState.ActiveStopWarningOnTheSecond;
      }
      this.remainingIntervalTime--;
    }
    // is it time to enter into Active states...
    else if ( ((remainingTime - this.modulusOffset) % this.activeTime) == 0 ) {
      this.state = IntervalState.ActiveStart;
      this.remainingIntervalTime = this.activeTime;
    }
    // decrement remainingIntervalTime only when time is a whole number (because timer is ticking at 100 ms rate...
    else if (Math.round(remainingTime) == remainingTime) {
      this.remainingIntervalTime--;
    }

    let remainingTimeISO:string = this.getRemainingTimeISO(this.totalmilliseconds - remainingmilliseconds);

    // if currently in warning state and on a whole second (not being the first second of this warning)...
    if( (this.state & IntervalState.GetReady) == IntervalState.GetReady &&
        (((this.state & IntervalState.RestStopWarningOnTheSecond) != IntervalState.RestStopWarningOnTheSecond) && ((this.state & IntervalState.ActiveStopWarningOnTheSecond) != IntervalState.ActiveStopWarningOnTheSecond))  &&
        (remainingTimeISO.split('.')[1] == '0')
    ) {
      // by adding this, it will construct an xWarningOnTheSecond state...
      this.state += IntervalState.Instant;
    }

    // 'x' has no value of use in this function. timelinePosition is its successor...
    this.timelinePosition++;

    return { state: this.state,
              remainingTime: remainingTimeISO,
              remainingIntervalTime: this.remainingIntervalTime,
              currentInterval: (this.intervals - this.currentInterval) };
  }

  getRemainingTimeISO (remainingmilliseconds: number): string {
    let s = new Date(0);
    s.setMilliseconds(this.totalmilliseconds - remainingmilliseconds);
    // returns this partial time segment: 01:02.3
    return s.toISOString().substr(14,7);
  }

  public play(): void {
    this.pauser.emit(false);
  }

  public pause(): void {
    this.pauser.emit(true);
  }

  public reset(): void {
    this.timelinePosition = 0;
    this.pause();
  }
}
