import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AITSignal } from '../../app/core/AITSignal';
import { AITStorage } from '../../app/core/AITStorage';
import { IntervalStorageData } from '../../app/app.component';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SequenceStates } from '../SotsForAit';
import { TimeEmission } from 'sots';
import { AITBasePage } from '../AITBasePage';

@IonicPage()
@Component({
  selector: 'page-interval-display',
  templateUrl: 'interval-display.html'
})
export class IntervalDisplayPage extends AITBasePage {
  @Input('data')
  get data(): IntervalStorageData {
    return this._data as IntervalStorageData;
  }
  set data(value: IntervalStorageData) {
    this._data = value;
  }

  remainingIntervalTime: number;
  currentInterval: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public signal: AITSignal,
    public ngDectector: ChangeDetectorRef,
    public splashScreen: SplashScreen,
    public insomnia: Insomnia) {
    super(navCtrl,
      navParams,
      menuCtrl,
      storage,
      signal,
      ngDectector,
      splashScreen,
      insomnia);
  }

  aitBuildTimer() {
    this.viewState = SequenceStates.Loaded;

    this.sots.build(this.data.countdown,
      this.data.intervals,
      this.data.activerest.lower,
      this.data.activerest.upper,
      this.data.warnings);

    super.aitBuildTimer();
  }

  aitSubscribeTimer(): void {
    this.sots.subscribe({
      next: (value: TimeEmission): void => {
        this.remainingSeqTime = this.sots.getTime(value);

        if (value.interval) {
          this.currentInterval = value.interval.current;
          this.remainingIntervalTime = Math.ceil(value.time);
        }

        if (value.state) {
          // if we dont negate the audiable states the display will "blink"
          // for a millisecond.
          let valueNoAudiable = (value.state.valueOf() as SequenceStates);
          valueNoAudiable &= (~SequenceStates.SingleBeep & ~SequenceStates.DoubleBeep);
          this.viewState = valueNoAudiable;

          // ...now take care of audiable states...
          if (value.state.valueOf(SequenceStates.SingleBeep)) {
            this.signal.single();
          } else if (value.state.valueOf(SequenceStates.DoubleBeep)) {
            this.signal.double();
          }
        }
      },
      error: (error: any): void => {
        this.viewState = SequenceStates.Error;
        error!;
      },
      complete: (): void => {
        this.viewState = SequenceStates.Completed;
        this.signal.triple();
        this.remainingSeqTime = this.sots.getTime();
      }
    });

    super.aitSubscribeTimer();
  }
}
