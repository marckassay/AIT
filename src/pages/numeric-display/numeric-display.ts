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

  onNext(): void {

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

export class AnotherIntervalTimer {
  source;
  subscription;

  initialize(activeTime:number, restTime:number, rounds:number, getReady:number=-1) {

    let roundTime: number = (activeTime + restTime);
    let totalTime: number = roundTime * rounds;
    let timerRounds: number = rounds;
    let offset: number;

    this.source = Rx.Observable.timer(0, 1000)
      .timeInterval()
      .map(function (x) {
        let remainingSeconds = totalTime - x.value;
        console.log("remainingSeconds: "+remainingSeconds)
        console.log("x: "+x.value)
        if(remainingSeconds % roundTime == 0) {
          timerRounds--;
          offset = restTime * timerRounds;
          console.log("At the "+remainingSeconds+" second-mark, enter into rest state");
        } else if(remainingSeconds % activeTime == offset) {
          console.log("At the "+remainingSeconds+" second-mark, enter into active state");
        }
        return x.value;
      })
      .take(totalTime);

    this.subscription = this.source.subscribe();
  }
}
