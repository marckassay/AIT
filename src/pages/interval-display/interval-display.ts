import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AITSoundboard } from '../../app/core/AITSoundboard';
import { AnotherIntervalTimer, IIntervalEmission, IntervalState } from '../../app/core/AnotherIntervalTimer';

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage implements OnInit {

  timer: AnotherIntervalTimer;
  emitted: IIntervalEmission;
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

  remainingTime: number | string;
  remainingIntervalTime: number;
  currentInterval: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this._state = IntervalState.Loaded;
    this.activeTime = 50;
    this.restTime = 10;
    this.intervals = 12;
    this.getReady = 3;

    this.remainingIntervalTime = this.restTime;
    this.currentInterval = this.intervals;
  }

  initTimer(): void {
    this.timer = new AnotherIntervalTimer();
    this.timer.initialize(this.activeTime, this.restTime, this.intervals, this.getReady);
    this.timer.source.subscribe((e: IIntervalEmission) => {

      // play sound each second for getReady states
      if ((e.state & (IntervalState.Start + IntervalState.Instant)) == (IntervalState.Start + IntervalState.Instant)) {
        AITSoundboard.ShortBeep();
      } else if ((e.state & (IntervalState.GetReady + IntervalState.Instant)) == (IntervalState.GetReady + IntervalState.Instant)) {
        AITSoundboard.LongBeep();
      }

      this._state = e.state;
      this.remainingIntervalTime = e.remainingIntervalTime;
      this.remainingTime = e.remainingTime;
      this.currentInterval = e.currentInterval;

    }, (err) => {

    }, () => {

      AITSoundboard.CompleteSound();
      this._state = IntervalState.Completed;
      this.remainingTime = this.timer.totalTimeISO;
    });
  }

  ionViewDidLoad(): void {
  }

	ngOnInit(): void  {
    this.initTimer();
  }
}
