import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AITStorage } from '../../app/core/AITStorage';
import { AITSignal } from '../../app/core/AITSignal';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';
import { AITBasePage } from '../AITBasePage';
import { SequenceStates } from '../../app/core/SotsForAit';
import { TimeEmission } from 'sots';
import { TimerStorageData } from '../../app/app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-timer-display',
  templateUrl: 'timer-display.html',
})
export class TimerDisplayPage extends AITBasePage {
  @Input('data')
  get data(): TimerStorageData {
    return this._uuidData as TimerStorageData;
  }
  set data(value: TimerStorageData) {
    this._uuidData = value;
  }
  _formattedGrandTime: string;
  get formattedGrandTime(): string {
    if (this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY) {
      return this.grandTime.replace(':', ':\r\n').replace('.', '.\r\n');
    } else {
      return this.grandTime;
    }
  }
  set formattedGrandTime(value: string) {
    this._formattedGrandTime = value;
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public signal: AITSignal,
    public ngDectector: ChangeDetectorRef,
    public splashScreen: SplashScreen,
    public insomnia: Insomnia,
    public screenOrientation: ScreenOrientation
  ) {
    super(navCtrl,
      navParams,
      menuCtrl,
      storage,
      signal,
      ngDectector,
      splashScreen,
      insomnia,
      screenOrientation);

    this.screenOrientation.onChange().subscribe(
      () => {
        // this is need to refresh the view when being revisited from changed in interval-settings
        this.ngDectector.detectChanges();
      }
    );
  }

  aitBuildTimer() {
    this.sots.build(this.data.countdown,
      this.data.time);

    super.aitBuildTimer();
  }

  aitSubscribeTimer(): void {
    this.sots.subscribe({
      next: (value: TimeEmission): void => {
        this.grandTime = this.sots.getGrandTime(value);

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
        this.grandTime = this.sots.getGrandTime();
      }
    });

    super.aitSubscribeTimer();
  }
}
