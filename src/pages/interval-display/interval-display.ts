import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AITSoundboard } from '../../app/core/AITSoundboard';
import { AnotherIntervalTimer, IIntervalEmission, IntervalState } from '../../app/core/AnotherIntervalTimer';
import { FabAction, FabEmission, FabContainerComponent } from '../../app/components/fabcontainer.component/fabcontainer.component'
import { Subscription } from 'rxjs';
import { IntervalSettingsPage } from "../pages";

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage implements OnInit {
  @ViewChild(FabContainerComponent)
  private menu: FabContainerComponent;

  timer: AnotherIntervalTimer;
  emitted: IIntervalEmission;
  subscription: Subscription;
  activeTime: number;
  restTime: number;
  intervals: number;
  getReady: number;
  countdown: number;

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

  }

  ngOnInit(): void {
    this.initializeDisplay();

  }

  initializeDisplay() {
    this._state = IntervalState.Loaded;

    this.activeTime = 50;
    this.restTime = 10;
    this.intervals = 12;
    this.getReady = 3;
    this.countdown = 15;

    this.remainingIntervalTime = this.restTime;
    this.currentInterval = this.intervals;

    this.instantiateTimer();
  }

  instantiateTimer() {
    this.timer = new AnotherIntervalTimer(this.activeTime, this.restTime, this.intervals, this.getReady, this.countdown);

    this.subscribeTimer();

    this.remainingTime = this.timer.totalTimeISO;
  }

  subscribeTimer(): void {
    this.subscription = this.timer.publication.subscribe((e: any) => {

      // play sound each second for getReady states
      if ((e.state & (IntervalState.Start + IntervalState.Instant)) == (IntervalState.Start + IntervalState.Instant)) {
        AITSoundboard.ShortBeep();
      } else if ((e.state & (IntervalState.GetReady + IntervalState.Instant)) == (IntervalState.GetReady + IntervalState.Instant)) {
        AITSoundboard.LongBeep();
      }
      console.log(e);
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

  onAction(emission: FabEmission) {
    switch (emission.action)
    {
      case FabAction.Start:
        this.timer.play();
        break;
      case FabAction.Pause:
        this.timer.pause();
        break;
      case FabAction.Reset:
        this.menu.reset();
        this.subscription.unsubscribe();
        this.initializeDisplay();
        break;
      case FabAction.Program:
        this.navCtrl.push(IntervalSettingsPage);
        break;
    }
    emission.container.close();
  }
}
