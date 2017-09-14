import Rx from 'rxjs/Rx';

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
	readonly state: IntervalState;
  readonly remainingTime: number;
  readonly remainingIntervalTime: number;
	readonly currentInterval: number;
}

export class AnotherIntervalTimer {
  source;
  totalTimeISO:string;

  initialize(activeTime:number, restTime:number, intervals:number, getReady:number=3) {
    const millisecond: number = 1000;
    const precision: number = 10; // one-tenth

    let intervalTime: number = (activeTime + restTime);
    let totalTime: number = intervalTime * intervals;
    const totalmilliseconds = totalTime * millisecond;

    let currentInterval: number = intervals;
    let modulusOffset: number;
    let state: IntervalState;
    let remainingIntervalTime: number;

    function getRemainingTimeISO (remainingmilliseconds: number):string {
      let s = new Date(0);
      s.setMilliseconds(totalmilliseconds - remainingmilliseconds);
      // returns this partial time segment: 01:02.3
      return s.toISOString().substr(14,7);
    }

    this.totalTimeISO = getRemainingTimeISO(0);

    this.source = Rx.Observable.timer(0, millisecond/precision)
      .timeInterval()
      .map(function (x) {
        let remainingTime = totalTime - (x.value/precision);
        let remainingmilliseconds: number = remainingTime * millisecond;
        modulusOffset = currentInterval * restTime;

        // strip away Start and/or Instant states if needed...those are momentary "sub" states
        if (state & IntervalState.Start) {
          state -= IntervalState.Start;
        }
        if (state & IntervalState.Instant) {
          state -= IntervalState.Instant;
        }

        // is it time to enter into Rest (and also check if we are Completed before changing to Rest)...
        if(remainingTime % intervalTime == 0) {
          if(remainingTime == 0) {
            state = IntervalState.Completed;
          } else {
            currentInterval--;
            state = IntervalState.RestStart;
            remainingIntervalTime = restTime;
          }
        }
        // is it time to enter into Warning states...(interesting that this 'else if' works for both warning states)
        else if ( ((remainingTime - modulusOffset - getReady) % activeTime) == 0 ) {
          if(state & IntervalState.Rest) {
            state = IntervalState.RestStopWarningOnTheSecond;
          } else if(state & IntervalState.Active) {
            state = IntervalState.ActiveStopWarningOnTheSecond;
          }
          remainingIntervalTime--;
        }
        // is it time to enter into Active states...
        else if ( ((remainingTime - modulusOffset) % activeTime) == 0 ) {
          state = IntervalState.ActiveStart;
          remainingIntervalTime = activeTime;
        }
        // decrement remainingIntervalTime only when time is a whole number (because timer is ticking at 100 ms rate...
        else if (Math.round(remainingTime) == remainingTime) {
          remainingIntervalTime--;
        }

        let remainingTimeISO:string = getRemainingTimeISO(totalmilliseconds - remainingmilliseconds);

        // if currently in warning state and on a whole second (not being the first second of this warning)...
        if( (state & IntervalState.GetReady) == IntervalState.GetReady &&
           (((state & IntervalState.RestStopWarningOnTheSecond) != IntervalState.RestStopWarningOnTheSecond) && ((state & IntervalState.ActiveStopWarningOnTheSecond) != IntervalState.ActiveStopWarningOnTheSecond))  &&
           (remainingTimeISO.split('.')[1] == '0')
        ) {
          // by adding this, it will construct an xWarningOnTheSecond state...
          state += IntervalState.Instant;
        }

        return { state: state,
                 remainingTime: remainingTimeISO,
                 remainingIntervalTime: remainingIntervalTime,
                 currentInterval: (intervals - currentInterval) };
      })
      .take(totalTime*precision);//precision acting as a factor here
  }
}
