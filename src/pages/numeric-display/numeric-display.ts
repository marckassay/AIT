import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  getReady: number;

  state: IntervalState;
  remainingTime: number;
  remainingIntervalTime: number;
  currentInterval: number;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.state = IntervalState.Loaded;
    this.getReady = 5;
    this.activeTime = 50;
    this.restTime = 10;
    this.intervals = 12;
    this.remainingTime = 50*10*12;
    this.remainingIntervalTime = 10;
    this.currentInterval = this.intervals;
  }

  initTimer(): void {
    this.timer = new AnotherIntervalTimer();
    this.timer.initialize(this.activeTime, this.restTime, this.intervals);
    this.timer.source.subscribe((e) => {
      this.state = e.state;
      this.remainingIntervalTime = e.remainingIntervalTime;
      this.remainingTime = e.remainingTime;
      this.currentInterval = e.currentInterval;

    }, (err) => {

    }, () => {
      this.state = IntervalState.Completed;
      this.remainingIntervalTime = 0;
      this.remainingTime = 0;
    });
  }

  onError(): void {

  }

  onComplete(): void {

  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad NumericDisplayPage');
  }

	ngOnInit(): void  {
    this.initTimer();
  }
}

export enum IntervalState {
  Loaded = 0,
  GetReady = 1,
  Active = 2,
  Rest = 3,
  Completed = 4,
  Error = 5
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

  initialize(activeTime:number, restTime:number, intervals:number, getReady:number=-1) {

    let roundTime: number = (activeTime + restTime);
    let totalTime: number = roundTime * intervals;
    let currentInterval: number = intervals;
    let offsetTime: number;
    let state: IntervalState;
    let remainingIntervalTime: number;

    this.source = Rx.Observable.timer(0, 100)
      .timeInterval()
      .map(function (x) {
        let remainingTime = totalTime - (x.value/10);
        offsetTime = currentInterval * restTime;

        if(remainingTime % roundTime == 0) {
          if(remainingTime == 0) {
              state = IntervalState.Completed;
          } else {
              currentInterval--;
              state = IntervalState.Rest;
              remainingIntervalTime = restTime;
          }
        } else if( ((remainingTime - offsetTime) % activeTime) == 0 ) {
            state = IntervalState.Active;
            remainingIntervalTime = activeTime;
        } else if (Math.round(remainingTime) == remainingTime){
          remainingIntervalTime--;
        }

        return { state: state,
                 remainingTime: remainingTime,
                 remainingIntervalTime: remainingIntervalTime,
                 currentInterval: (intervals - currentInterval)};
      })
      .take(totalTime*10);
  }
}
