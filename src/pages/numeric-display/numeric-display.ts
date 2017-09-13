import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Howl } from 'howler';
import Rx from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/timer';
// import 'rxjs/add/operator/timeInterval';
// import 'rxjs/add/operator/take';
// import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-numeric-display',
  templateUrl: 'numeric-display.html'
})
export class NumericDisplayPage implements OnInit {

  timer: AnotherIntervalTimer;
  emitted: IIntervalTimerEmission;
  activeTime: number;
  restTime: number;
  intervals: number;
  getReady: number = 0;

  public intervalState = IntervalState;

  _state: IntervalState;

  // if _state contains irrevlant bits to the view, "reduce" by removing those bits
  get viewState (): IntervalState {
    let _state_temp = this._state;
    // strip away Start and/or Instant states if needed...
    if (_state_temp & IntervalState.Start) {
      _state_temp -= IntervalState.Start;
    }
    if (_state_temp & IntervalState.Instant) {
      _state_temp -= IntervalState.Instant;
    }

    return _state_temp;
  }

  remainingTime: number;
  remainingIntervalTime: number;
  currentInterval: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this._state = IntervalState.Loaded;
    this.activeTime = 50;
    this.restTime = 10;
    this.intervals = 12;
    this.getReady = 3;
    // TODO: format to ISO string segment...
    this.remainingTime = ((this.activeTime + this.restTime) * this.intervals);
    this.remainingIntervalTime = this.restTime;
    this.currentInterval = this.intervals;
  }

  initTimer(): void {
    this.timer = new AnotherIntervalTimer();
    this.timer.initialize(this.activeTime, this.restTime, this.intervals, this.getReady);
    this.timer.source.subscribe((e) => {
      // play sound each second for getReady states
      if ((e.state & (IntervalState.Start + IntervalState.Instant)) == (IntervalState.Start + IntervalState.Instant)) {
        AITSound.ShortBeep();
      } else if ((e.state & (IntervalState.GetReady + IntervalState.Instant)) == (IntervalState.GetReady + IntervalState.Instant)) {
        AITSound.LongBeep();
      }

      this._state = e.state;
      this.remainingIntervalTime = e.remainingIntervalTime;
      this.remainingTime = e.remainingTime;
      this.currentInterval = e.currentInterval;

     // console.log(e.state);
     // console.log(e.remainingIntervalTime);
     // console.log(e.remainingTime);
     // console.log(e.currentInterval);
     // console.log(' ');
    }, (err) => {

    }, () => {
      this._state = IntervalState.Completed;
      this.remainingIntervalTime = 0;
      this.remainingTime = 0;

      AITSound.CompleteSound();
    });
  }

  ionViewDidLoad(): void {
  }

	ngOnInit(): void  {
    this.initTimer();
  }
}

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

export interface IIntervalTimerEmission {
	readonly state: IntervalState;
  readonly remainingTime: number;
  readonly remainingIntervalTime: number;
	readonly currentInterval: number;
}

export class AnotherIntervalTimer {
  source;
  subscription;

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

    this.source = Rx.Observable.timer(0, millisecond/precision)
      .timeInterval()
      .map(function (x) {
        let s = new Date(0);
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

        s.setMilliseconds(totalmilliseconds - remainingmilliseconds);
        // returns this partial time segment: 01:02.3
        let remainingTimeISO:string = s.toISOString().substr(14,7);

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

export class AITSound {
  static sound_1 = new Howl({
    src: ['assets/sounds/Speech Off.wav']
  });

  static sound_2 = new Howl({
    src: ['assets/sounds/Speech On.wav']
  });

  static ShortBeep = () => {
    AITSound.sound_1.play();
  };

  static LongBeep = () => {
    AITSound.sound_2.play();
  };

  static CompleteSound = () => {
    AITSound.sound_2.play();
  };
}
