import { AITSignal } from '../../app/core/AITSignal';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FabAction, FabContainerComponent, FabEmission } from '../../app/components/fabcontainer.component/fabcontainer.component';
import { AITStorage } from '../../app/core/AITStorage';
import { IntervalStorageData } from '../../app/app.component';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { Insomnia } from '@ionic-native/insomnia';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IntervalSeq, SeqStates } from './interval-sots';
import { TimeEmission } from 'sots';
import { PartialObserver } from 'rxjs/Observer';

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage {
  @Input('data')
  _data: IntervalStorageData;
  get data(): IntervalStorageData {
    return this._data;
  }
  set data(value: IntervalStorageData) {
    this._data = value;
  }

  @ViewChild(FabContainerComponent)
  private menu: FabContainerComponent;

  // this type assignment to variable is for angular view.
  public states = SeqStates;
  viewState: SeqStates;

  remainingSeqTime: string;
  remainingIntervalTime: number;
  currentInterval: number;

  private observer: PartialObserver<TimeEmission>;
  private currentUUID: string;
  private sots: IntervalSeq;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public signal: AITSignal,
    public ngDectector: ChangeDetectorRef,
    public splashScreen: SplashScreen,
    public insomnia: Insomnia) {

  }

  ionViewDidLoad() {
    // if coming from right sidemenu (or any sidemenu), no 'ionXxx()' will be
    // called since sidemenus are just menus, not pages.
    this.menuCtrl.get('right').ionClose.debounceTime(250).subscribe(() => {
      this.reloadViewAndTimer();
    });

    this.reloadViewAndTimer();
  }

  ionViewDidEnter() {
    this.setViewInRunningMode(false);
  }

  reloadViewAndTimer() {
    this.setViewInRunningMode(false);
    this.retrieveDataAndBuildTimer();
  }

  retrieveDataAndBuildTimer(): void {
    const uuid = (this.navParams.data) ? this.navParams.data : this.currentUUID;

    if (uuid) {
      this.menu.reset();

      this.storage.getItem(uuid).then((value: any) => {
        this.data = (value as IntervalStorageData);
        this.buildAndSubscribeTimer();

        // TOOD: can't seem to hide startup flash of white other then
        // to do the following:
        setTimeout(() => {
          this.splashScreen.hide();
        }, 500);

      }).catch(() => {
        // console.log("interval-display preinitializeDisplay error")
      });
    }
  }

  buildAndSubscribeTimer() {
    this.viewState = SeqStates.Loaded;

    this.sots = new IntervalSeq();
    this.sots.build(this.data.countdown,
      this.data.intervals,
      this.data.activerest.lower,
      this.data.activerest.upper,
      this.data.warnings);

    this.subscribeTimer();
    this.setRemainingSeqAndIntervalTimes();
  }

  subscribeTimer(): void {
    this.observer = {
      next: (value: TimeEmission): void => {
        this.setRemainingSeqAndIntervalTimes(value);

        if (value.interval) {
          this.currentInterval = value.interval.current;
        }

        if (value.state) {
          // if we dont negate the audiable states the display will "blink"
          // for a millisecond.
          let valueNoAudiable = (value.state.valueOf() as SeqStates);
          valueNoAudiable &= (~SeqStates.SingleBeep & ~SeqStates.DoubleBeep);
          this.viewState = valueNoAudiable;

          // ...now take care of audiable states...
          if (value.state.valueOf(SeqStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SeqStates.DoubleBeep)) {
            this.signal.double();
          }
        }
      },
      error: (error: any): void => {
        this.viewState = SeqStates.Error;
        error!;
      },
      complete: (): void => {
        this.viewState = SeqStates.Completed;
        this.signal.triple();
        this.setRemainingSeqAndIntervalTimes();
      }
    };

    this.sots.sequencer.subscribe(this.observer);

    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();
  }

  resetViewAndTimer() {
    this.viewState = SeqStates.Loaded;

    this.sots.sequencer.reset();
    this.setRemainingSeqAndIntervalTimes();

    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();
  }

  setRemainingSeqAndIntervalTimes(value?: TimeEmission): void {
    this.remainingSeqTime = this.sots.calculateRemainingTime(value);
    this.remainingIntervalTime = (value) ? Math.ceil(value.time) : this.data.activerest.lower;
  }

  setViewInRunningMode(value: boolean) {
    this.menuCtrl.enable(!value, 'left');
    this.menuCtrl.enable(!value, 'right');
    (value) ? this.insomnia.keepAwake() : this.insomnia.allowSleepAgain();
  }

  onAction(emission: FabEmission) {
    switch (emission.action) {
      case FabAction.Home:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        this.menuCtrl.open('left');
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        this.menuCtrl.open('right');
        break;
      case FabAction.Reset:
        this.resetViewAndTimer();
        this.setViewInRunningMode(false);
        break;
      case FabAction.Start:
        this.sots.sequencer.start();
        this.setViewInRunningMode(true);
        break;
      case FabAction.Pause:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        break;
    }
    emission.container.close();
  }
}
