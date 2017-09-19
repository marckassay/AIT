import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AITSoundboard } from '../../app/core/AITSoundboard';
import { AnotherIntervalTimer, IIntervalEmission, IntervalState } from '../../app/core/AnotherIntervalTimer';
import { FabAction, FabEmission } from '../../app/components/fabcontainer.component/fabcontainer.component'

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage implements OnInit {
  fabContainerHide: boolean;
  timer: AnotherIntervalTimer;
  emitted: IIntervalEmission;
  activeTime: number;
  restTime: number;
  intervals: number;
  getReady: number = 0;

  remainingTime: string;
  remainingIntervalTime: number;
  currentInterval: number;

  public states = IntervalState;
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeDisplay();
  }

  initializeDisplay() {
    this._state = IntervalState.Loaded;
    this.fabContainerHide = false;

    this.activeTime = 50;
    this.restTime = 10;
    this.intervals = 12;
    this.getReady = 3;

    this.remainingIntervalTime = this.restTime;
    this.currentInterval = this.intervals;

    this.instantiateTimer();
  }

  instantiateTimer() {
    this.timer = new AnotherIntervalTimer(this.activeTime, this.restTime, this.intervals, this.getReady);
    //this.timer.initialize();
    this.remainingTime = this.timer.totalTimeISO;
  }

  subscribeTimer(): void {
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

  startTimer(): void {
    this.subscribeTimer();
  }
  pauseTimer(): void {
    this.timer.pause();
  }
  resetTimer(): void {
    this.initializeDisplay();
  }

  ionViewDidLoad(): void {
  }

	ngOnInit(): void  {
  }

  onAction(emission: FabEmission) {

    switch (emission.action)
    {
      case FabAction.Start:
          this.startTimer();
        break;
      case FabAction.Pause:
          this.pauseTimer();
        break;
      case FabAction.Reset:
          this.resetTimer();
        break;
    }

    emission.container.close();
  }
}
