import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { CountdownTimer } from './CountdownTimer';
import * as app from '../app.component';

export enum IntervalState {
  Loaded    = 1,
  GetReady  = 2,
  Active    = 4,
  Rest      = 8,
  Completed = 16,
  Error     = 32,
  Start     = 64,
  Instant   = 128,
  Warning   = 256,
  Countdown = 512,

  ActiveStart = Active + Start + Instant,
  ActiveStopWarning = Active + GetReady,
  ActiveStopWarningOnTheSecond = ActiveStopWarning + Instant,
  ActiveWarning = Active + Warning,

  RestStart = Rest + Start + Instant,
  RestStopWarning = Rest + GetReady,
  RestStopWarningOnTheSecond = RestStopWarning + Instant,
}

export interface IIntervalEmission {
   timelinePosition: number;
	 state: IntervalState;
   remainingTime: string;
   remainingIntervalTime: number;
	 currentInterval: number;
}

export class AnotherIntervalTimer {
  timelineMaxLimit: number;
  pauser: Subject<boolean>;
  source: Observable<app.ITimelinePosition>;
  publication: Observable<app.ITimelinePosition>;

  millisecond: number = 1000;
  precision: number = 10; // one-tenth

  totalTimeISO:string;
  intervalTime: number;
  totalTime: number;

  currentInterval: number;
  modulusOffset: number;
  state: IntervalState;
  remainingIntervalTime: number;
  timelinePosition: number = 0;

  constructor(private activeTime:number,
              private restTime:number,
              private intervals:number,
              private getReady:number=3,
              private countdown:number=10,
              private warnings:app.CountdownWarnings) {
    this.intervalTime = activeTime + restTime;
    this.totalTime = this.intervalTime * this.intervals;
    this.timelineMaxLimit = this.totalTime * this.precision;// precision being used as a factor here...

    this.initializeTimer();
  }

  initializeTimer(): void {
    this.currentInterval = this.intervals;

    this.totalTimeISO = app.getRemainingTimeISO( this.totalTime * this.millisecond );

    this.pauser = new Subject<boolean>();

    // always advance the timelinePosition to by-pass the first rest segment of the first
    // interval.  Because the CountdownTimer will give us the audibles and visuals. we
    // dont want to get-ready for the start of a rest period...
    this.timelinePosition = (this.restTime * this.precision);
    this.state = IntervalState.ActiveStart;
    this.remainingIntervalTime = 1;
    this.currentInterval = this.intervals -1;

    const sequenceA = new CountdownTimer(this.countdown, this.getReady, true).source;

    const sequenceB = Observable.timer(0, this.millisecond/this.precision)
                                .map((x) => this.interval(x))
                                .takeWhile((x: app.ITimelinePosition) => {return (x.timelinePosition <= this.timelineMaxLimit)});

    this.source = Observable.concat(sequenceA, sequenceB);

    this.pauser.next(true);

    this.publication = this.pauser.switchMap( (paused) => (paused == true) ? Observable.never() : this.source );
  }

  interval(x: any): IIntervalEmission {
    let remainingTime = +((this.totalTime - (this.timelinePosition/this.precision)).toFixed(1));
    let remainingmilliseconds: number = remainingTime * this.millisecond;
    this.modulusOffset = this.currentInterval * this.restTime;

    // strip away Start, Warning and/or Instant states if needed...those are momentary "sub" states
    if (this.state & IntervalState.Start) {
      this.state -= IntervalState.Start;
    }
    if (this.state & IntervalState.Instant) {
      this.state -= IntervalState.Instant;
    }
    if (this.state & IntervalState.Warning) {
      this.state -= IntervalState.Warning;
    }

    if(remainingTime == 0) {
      this.state = IntervalState.Completed;
    }
    // is it time to enter into Rest...
    else if(remainingTime % this.intervalTime == 0) {
      this.currentInterval--;
      this.state = IntervalState.RestStart;
      this.remainingIntervalTime = this.restTime;
    }
    // is it time to enter into Warning states...
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

    let remainingTimeISO:string = app.getRemainingTimeISO(remainingmilliseconds);

    // if currently in warning state and on a whole second (not being the first second of this warning)...
    if( (this.state & IntervalState.GetReady) == IntervalState.GetReady &&
        (((this.state & IntervalState.RestStopWarningOnTheSecond) != IntervalState.RestStopWarningOnTheSecond) && ((this.state & IntervalState.ActiveStopWarningOnTheSecond) != IntervalState.ActiveStopWarningOnTheSecond))  &&
        (remainingTimeISO.split('.')[1] == '0')
    ) {
      // by adding this, it will construct an xWarningOnTheSecond state...
      this.state += IntervalState.Instant;
    }
    // if its Active state and if current-interval-time is at a enabled warning (5,10,15)...
    else if(((this.state & IntervalState.Active) == IntervalState.Active) &&
      this.atWarningTime(this.remainingIntervalTime) &&
      (remainingTimeISO.split('.')[1] == '0')) {
      this.state = IntervalState.ActiveWarning;
    }

    return {  timelinePosition: this.timelinePosition++,
              state: this.state,
              remainingTime: remainingTimeISO,
              remainingIntervalTime: this.remainingIntervalTime,
              currentInterval: (this.intervals - this.currentInterval) };
  }

  atWarningTime(currentActiveTime:number): boolean {
    if( ((this.warnings.fivesecond == true) && (currentActiveTime == 5)) ||
        ((this.warnings.tensecond == true) && (currentActiveTime == 10)) ||
        ((this.warnings.fifthteensecond == true) && (currentActiveTime == 15)) ){
      return true;
    }
  }

  public play(): void {
    this.pauser.next(false);
  }

  public pause(): void {
    this.pauser.next(true);
  }

  public reset(): void {
    this.timelinePosition = 0;
    this.pause();
  }
}
