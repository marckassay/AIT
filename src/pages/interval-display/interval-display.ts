import { Component, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FabAction, FabEmission, FabContainerComponent } from '../../app/components/fabcontainer.component/fabcontainer.component'
import { Subscription, Observer } from 'rxjs';
import { AITStorage } from '../../app/core/AITStorage';
import { IntervalStorageData } from '../../app/app.component';
import { AITSignal } from '../../app/core/AITSignal';
import { Insomnia } from '@ionic-native/insomnia';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IntervalSeq, SeqStates } from './interval-sots';
import { TimeEmission } from 'sots';
import { PartialObserver } from 'rxjs/Observer';
import * as _ from "lodash";
import * as moment from 'moment';

export enum IntervalState {
  Loaded = 1,
  GetReady = 2,
  Active = 4,
  Rest = 8,
  Completed = 16,
  Error = 32,
  Start = 64,
  Instant = 128,
  Warning = 256,
  Countdown = 512,

  ActiveStart = Active + Start + Instant,
  ActiveStopWarning = Active + GetReady,
  ActiveStopWarningOnTheSecond = ActiveStopWarning + Instant,
  ActiveWarning = Active + Warning,

  RestStart = Rest + Start + Instant,
  RestStopWarning = Rest + GetReady,
  RestStopWarningOnTheSecond = RestStopWarning + Instant,
}

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage {
  @ViewChild(FabContainerComponent)
  private menu: FabContainerComponent;

  current_uuid: string;
  subscription: Subscription;
  seq: IntervalSeq;
  remainingTime: string;
  remainingIntervalTime: number;
  currentInterval: number;
  _data: IntervalStorageData;
  // used in ionViewDidLoad to load data for the initial loading.  after
  // ionViewDidLoad is called, ionViewDidEnter is then called; hence, we
  // dont want to run the same data twice.
  immediatelyPostViewDidLoad: boolean;

  get data(): IntervalStorageData {
    return this._data;
  }

  @Input('data')
  set data(value: IntervalStorageData) {
    this._data = value;
  }

  public states = SeqStates;
  viewState: SeqStates;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public signal: AITSignal,
    public ngDectector: ChangeDetectorRef,
    public splashScreen: SplashScreen,
    public insomnia: Insomnia) {

    // if coming from right sidemenu (or any sidemenu), no 'ionXxx()' will be
    // called since sidemenus are just menus, not pages.
    menuCtrl.get('right').ionClose.debounceTime(250).subscribe(() => {
      this.ionViewDidEnterInterior();
    });
  }

  ionViewDidLoad() {
    this.seq = new IntervalSeq();

    this.ionViewDidEnterInterior();
    this.immediatelyPostViewDidLoad = true;
  }

  ionViewDidEnter() {
    if (!this.immediatelyPostViewDidLoad) {
      this.ionViewDidEnterInterior();
    } else {
      this.immediatelyPostViewDidLoad = false;
    }
  }

  ionViewDidEnterInterior() {
    this.setNotRunningFeatures();
    this.getIntervalStorageData();
  }

  getIntervalStorageData(): void {
    const uuid = (this.navParams.data) ? this.navParams.data : this.current_uuid;

    if (uuid) {
      this.menu.reset();
      if ((<Subscription>this.subscription) && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }
      this.storage.getItem(uuid).then((value: any) => {
        this.data = (value as IntervalStorageData);
        this.instantiateTimer();

        // TOOD: can't seem to hide startup flash of white other then
        // to do the following:
        setTimeout(() => {
          this.splashScreen.hide();
        }, 500);

      }).catch((reject) => {
        //console.log("interval-display preinitializeDisplay error")
      });
    }
  }

  instantiateTimer() {
    this.viewState = SeqStates.Loaded;
    this.remainingIntervalTime = this.data.activerest.lower;

    this.seq.build(this.data.countdown,
      this.data.intervals,
      this.data.activerest.lower,
      this.data.activerest.upper,
      this.data.warnings);

    this.subscribeTimer();
    this.remainingTime = this.seq.calculateRemainingTime();

    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();
  }

  reset() {
    this.viewState = SeqStates.Loaded;
    this.remainingIntervalTime = this.data.activerest.lower;

    this.seq.sequencer.reset();
    this.remainingTime = this.seq.calculateRemainingTime();

    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();
  }

  subscribeTimer(): void {
    let observer: PartialObserver<TimeEmission> = {
      next: (value: TimeEmission): void => {
        this.remainingTime = this.seq.calculateRemainingTime(value);
        this.remainingIntervalTime = Math.ceil(value.time);

        if (value.interval) {
          this.currentInterval = value.interval.current;
        }

        if (value.state) {
          let valueNoAudiable = (value.state.valueOf() as SeqStates);
          valueNoAudiable &= (~SeqStates.SingleBeep & ~SeqStates.DoubleBeep);
          this.viewState = valueNoAudiable;

          // take care of all instant states...
          if (value.state.valueOf(SeqStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SeqStates.DoubleBeep)) {
            this.signal.double();
          }
        }
      },
      error: (error: any): void => {
        this.viewState = SeqStates.Error;
      },
      complete: (): void => {
        this.viewState = SeqStates.Completed;
      }
    };

    this.seq.subscribe(observer);
  }

  setRunningFeatures() {
    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
    this.insomnia.keepAwake();
  }

  setNotRunningFeatures() {
    this.menuCtrl.enable(true, 'left');
    this.menuCtrl.enable(true, 'right');
    this.insomnia.allowSleepAgain();
  }

  onAction(emission: FabEmission) {
    switch (emission.action) {
      case FabAction.Home:
        this.seq.sequencer.pause();
        this.setNotRunningFeatures();
        this.menuCtrl.open("left");
        break;
      case FabAction.Start:
        this.seq.sequencer.start();
        this.setRunningFeatures();
        break;
      case FabAction.Pause:
        this.seq.sequencer.pause();
        this.setNotRunningFeatures();
        break;
      case FabAction.Reset:
        this.reset();
        this.setNotRunningFeatures();
        break;
      case FabAction.Program:
        this.seq.sequencer.pause();
        this.setNotRunningFeatures();
        this.menuCtrl.open("right");
        break;
    }
    emission.container.close();
  }
}
