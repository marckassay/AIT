import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { BrightnessUtil, ScreenService } from 'src/app/services/screen.service';
import { SignalService } from 'src/app/services/signal.service';
import { StorageDefaultData } from 'src/app/services/storage/ait-storage.defaultdata';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';
// tslint:disable-next-line:max-line-length
import { AccentTheme, AppStorageData, BaseTheme, BrightnessSet, OrientationSetting, VolumeSet } from 'src/app/services/storage/ait-storage.shapes';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html'
})
export class AppSettingsPage implements OnInit, OnDestroy {
  readonly uuid = StorageDefaultData.APP_ID;

  _data: AppStorageData;
  get data(): AppStorageData {
    return this._data;
  }
  set data(value: AppStorageData) {
    this._data = value;
  }

  /**
   * this type assignment to variable is for Angular template can access enum values.
   */
  protected BT = BaseTheme;
  protected AT = AccentTheme;
  protected OR = OrientationSetting;

  /**
   * since the 'remember device volume' toggle can be disabled and checked simultaneously or enabled and unchecked,
   * this property is to do logic to determine if `data.sound` is truthly or not.
   */
  isVolToggleChecked: boolean;

  /**
   * although BrightnessSet value may be below zero, the UI is constrained to 10 and above. so this
   * property conforms to that contraint.
   */
  absoluteBrightnessValue: BrightnessSet;

  private appSubjt: BehaviorSubject<AppStorageData>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected changeRef: ChangeDetectorRef,
    protected menuCtrl: MenuController,
    protected signalSvc: SignalService,
    protected screenSvc: ScreenService,
    protected storage: AITStorage
  ) { }

  ngOnInit(): void {
    const getSubject = async (): Promise<void> => {
      await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
        .then((value) => {
          this.appSubjt = value;
          this.subscribe();
        });
    };
    getSubject();
  }

  ionViewWillEnter(): void {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  ionViewWillLeave(): void {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  ngOnDestroy(): void {
    this.next();
  }

  private subscribe(): void {
    const appSubsn = this.appSubjt.subscribe((value) => {
      this.data = value;
    });
    appSubsn.unsubscribe();

    this.isVolToggleChecked = this.data.sound > 0;
    this.absoluteBrightnessValue = BrightnessUtil.absolute(this.data.brightness);
  }

  private next(): void {
    this.appSubjt.next(this.data);
  }

  /**
   * The 'sound' toggle handler.
   */
  toggleSound(): void {
    if (this.data.sound === 0) {
      this.signalSvc.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
        .then(() => {
          // now that sound has bee enabled, retrieve value for value. although this may be a
          // negative value, its of no consequence of for this `toggleSound()`.
          this.signalSvc.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
            .then((result) => {
              this.data.sound = result.volume as VolumeSet;
            });
          this.next();
        });
    } else if (Math.abs(this.data.sound) > 0) {
      this.data.sound = 0;
      this.next();
    }
  }

  /**
   * The 'TEST VOLUME' button handler. This button is only enabled
   * when: `Math.abs(this.data.sound) > 0`.
   */
  testVolume(): void {
    this.signalSvc.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
      .then((result) => {
        this.data.sound = result.volume as VolumeSet;
        this.signalSvc.double();
      });
  }

  /**
   * The 'remember device volume' toggle handler. This toggle is only enabled
   * when: `Math.abs(this.data.sound) > 0`. And it simply will reverse the sign of `this.data.sound`
   * to indicate that a value of less than 0 disables this "remember volume" feature, while a sign
   * of greater than 0 enables it.
   */
  toggleRememberVolume(): void {
    this.data.sound = (this.data.sound * -1) as VolumeSet;
    this.next();
  }

  /**
   * The 'remember device brightness' toggle handler.
   */
  toggleRememberBrightness(): void {
    this.data.brightness = BrightnessUtil.reverseSign(this.data.brightness);
  }

  /**
  * The range UI for 'remember device brightness' toggle.
  */
  rangeBrightnessValue(event: CustomEvent): void {
    // TODO: async to change device brightness momentarily
    this.data.brightness = (event.detail.value as BrightnessSet);
  }

  toggleBaseTheme(value: BaseTheme): void {
    this.data.base = value;
    this.next();
  }

  toggleAccentTheme(value: AccentTheme): void {
    this.data.accent = value;
    this.next();
  }

  toggleOrientation(event: CustomEvent): void {
    this.data.orientation = +(event.detail.value) as OrientationSetting;
  }
}
