import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Navbar, MenuController } from 'ionic-angular';
import { AITSoundboard } from '../../app/core/AITSoundboard';
import { AnotherIntervalTimer, IIntervalEmission, IntervalState } from '../../app/core/AnotherIntervalTimer';
import { FabAction, FabEmission, FabContainerComponent } from '../../app/components/fabcontainer.component/fabcontainer.component'
import { Subscription } from 'rxjs';
import { IntervalSettingsPage } from "../pages";
import { Storage } from '../../app/core/Storage';
import { IntervalStorageData } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage {
  @ViewChild(Navbar)
  navbar: Navbar;

  @ViewChild(FabContainerComponent)
  private menu: FabContainerComponent;

  timer: AnotherIntervalTimer;
  emitted: IIntervalEmission;
  subscription: Subscription;

  remainingTime: string;
  remainingIntervalTime: number;
  currentInterval: number;

  _data: IntervalStorageData;

  get data(): IntervalStorageData {
    return this._data;
  }

  set data(value: IntervalStorageData) {
    this._data = value;
  }

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
    if (_state_temp & IntervalState.Warning) {
      _state_temp -= IntervalState.Warning;
    }

    return _state_temp;
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage) {}

  ionViewWillEnter() {
    this.preinitializeDisplay();
  }

  ionViewDidLoad() {
    this.preinitializeDisplay();
   // this.navbar.hideBackButton = true;
    //this.navCtrl.insert(1, IntervalSettingsPage, "abc123");
  }

  preinitializeDisplay(): void {
    const uuid = (<IntervalStorageData>this.navParams.data).uuid;
    this.menu.reset();
    if((<Subscription>this.subscription) && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.storage.getItem(uuid).then((value) => {
      this.data = value;
      this.initializeDisplay();
    }).catch((reject) => {
      console.log("interval-display preinitializeDisplay error")
    });
  }

  initializeDisplay() {
    this._state = IntervalState.Loaded;
    this.remainingIntervalTime = this.data.activerest.lower;
    this.currentInterval = this.data.intervals;

    this.instantiateTimer();
  }

  instantiateTimer() {
    this.timer = new AnotherIntervalTimer(this.data.activerest.upper,
                                          this.data.activerest.lower,
                                          this.data.intervals,
                                          this.data.getready,
                                          this.data.countdown,
                                          this.data.warnings);
    this.subscribeTimer();
    this.remainingTime = this.timer.totalTimeISO;
  }

  subscribeTimer(): void {
    this.subscription = this.timer.publication.subscribe((e: any) => {
      // play sound each second for getReady states
      if ((e.state & (IntervalState.Start + IntervalState.Instant)) == (IntervalState.Start + IntervalState.Instant) ||
          ((e.state & IntervalState.ActiveWarning) == IntervalState.ActiveWarning) ) {
        AITSoundboard.ShortBeep();
      } else if ((e.state & (IntervalState.GetReady + IntervalState.Instant)) == (IntervalState.GetReady + IntervalState.Instant)) {
        AITSoundboard.TripleBeep();
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
      case FabAction.Home:
        this.timer.pause();
       // this.navCtrl.popToRoot();
        this.navCtrl.pop(null, null);
        break;
      case FabAction.Start:
        this.timer.play();
        break;
      case FabAction.Pause:
        this.timer.pause();
        break;
      case FabAction.Reset:
        this.preinitializeDisplay();
        break;
      case FabAction.Program:
        this.navCtrl.push(IntervalSettingsPage, this.data.uuid);
        break;
    }
    emission.container.close();
  }
}
