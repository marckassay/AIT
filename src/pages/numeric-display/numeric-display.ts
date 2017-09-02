import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import Rx from 'rxjs/Rx';

export enum IntervalState {
  Loaded = 0,
  GetReady = 1,
  Active = 2,
  Rest = 3,
  Finished = 4
}

@IonicPage()
@Component({
  selector: 'page-numeric-display',
  templateUrl: 'numeric-display.html'
})
export class NumericDisplayPage implements OnInit {

  state: IntervalState;
  timer: AnotherIntervalTimer;
  getReady: number;
  activeTime: number;
  restTime: number;
  rounds: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.state = IntervalState.Loaded;
    this.getReady = 5;
    this.activeTime = 50;
    this.restTime = 10;
    this.rounds = 12;

    this.initTimer();
  }

  initTimer(): void {
    this.timer = new AnotherIntervalTimer();
    this.state = IntervalState.Rest;

    this.timer.initialize(this.activeTime, this.restTime, this.rounds, this.getReady);
    this.timer.source.subscribe(this.onNext, this.onError, this.onComplete);
  }

  onNext(e:IIntervalTimerEmission): void {
    console.log("-->"+e.state+" "+e.remainingTime);
  }

  onError(): void {

  }

  onComplete(): void {

  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad NumericDisplayPage');
  }

	ngOnInit(): void  {

  }
}

export interface IIntervalTimerEmission {
	readonly state: IntervalState;
	readonly remainingTime: number;
	readonly currentRound: number;
}
export class AnotherIntervalTimer {

  source;
  subscription;

  initialize(activeTime:number, restTime:number, rounds:number, getReady:number=-1) {

    let roundTime: number = (activeTime + restTime);
    let totalTime: number = roundTime * rounds;
    let currentRound: number = rounds;
    let offsetTime: number;
    let state: IntervalState;

    this.source = Rx.Observable.timer(0, 1000)
      .timeInterval()
      .map(function (x) {
        let remainingTime = totalTime - x.value;
        offsetTime = currentRound * restTime;

        if(remainingTime % roundTime == 0) {
          if(remainingTime == 0) {
              state = IntervalState.Finished;

              return {state: state, remainingTime: 0, currentRound: -1};
          }else{
              currentRound--;
              state = IntervalState.Rest;

              return {state: state, remainingTime: remainingTime, currentRound: currentRound};
          }
        } else if( ((remainingTime - offsetTime) % activeTime) == 0 ) {
            state = IntervalState.Active;

            return {state: state, remainingTime: remainingTime, currentRound: currentRound};
        } else {
          return {state: state, remainingTime: remainingTime, currentRound: currentRound};
        }
      })
      .take(totalTime);
  }
}
