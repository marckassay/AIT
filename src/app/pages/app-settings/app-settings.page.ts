import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { BrightnessUtil, ScreenService } from 'src/app/services/screen.service';
import { SignalService } from 'src/app/services/signal.service';
import { StorageDefaultData } from 'src/app/services/storage/ait-storage.defaultdata';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';
import { AccentTheme, AppStorageData, BaseTheme, BrightnessSet } from 'src/app/services/storage/ait-storage.shapes';

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

  absoluteBrightnessValue: BrightnessSet;
  soundToggleWillEnter: boolean;
  soundRememberToggleWillEnter: boolean;

  private appSubjt: BehaviorSubject<AppStorageData>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected changeRef: ChangeDetectorRef,
    protected menuCtrl: MenuController,
    protected signal: SignalService,
    protected screen: ScreenService,
    protected storage: AITStorage
  ) { }

  ngOnInit() {
    const getSubject = async () => {
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

  ngOnDestroy() {
  }

  private subscribe() {
    const appSubsn = this.appSubjt.subscribe((value) => {
      this.data = value;
      this.absoluteBrightnessValue = BrightnessUtil.absolute(this.data.brightness);
      this.soundToggleWillEnter = (this.data.sound !== 0);
      this.soundRememberToggleWillEnter = this.data.sound > 0;
    });
    appSubsn.unsubscribe();
  }

  /**
   * The 'sound' toggle handler.
   */
  toggleSound(): void {
    if (this.data.sound === 0) {
      this.signal.audio.setAudioMode(AudioManagement.AudioMode.NORMAL)
        .then(() => {
          // now that sound has bee enabled, retrieve value for value. although this may be a
          // negative value, its of no consequence of for this `toggleSound()`.
          this.signal.audio.getVolume(AudioManagement.VolumeType.MUSIC)
            .then((result) => { this.data.sound = result.volume; });
        });
    } else if (Math.abs(this.data.sound) > 0) {
      this.data.sound = 0;
    }
  }

  /**
   * The 'TEST VOLUME' button handler. This button is only enabled
   * when: `Math.abs(this.data.sound) > 0`.
   */
  testVolume(): void {
    this.signal.audio.getVolume(AudioManagement.VolumeType.MUSIC)
      .then((result) => {
        this.data.sound = result.volume;
        this.signal.double();
      });
  }

  /**
   * The 'remember device volume' toggle handler. This toggle is only enabled
   * when: `Math.abs(this.data.sound) > 0`. And it simply will reverse the sign of `this.data.sound`
   * to indicate that a value of less than 0 disables this "remember volume" feature, while a sign
   * of greater than 0 enables it.
   */
  toggleRememberVolume(): void {
    if (this.data.sound !== 0) {
      this.data.sound = (this.data.sound * -1);
    }
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
  brightnessChanged(event: any): void {
    // TODO: async to change device brightness momentarily
    this.data.brightness = (event.value as BrightnessSet);
  }

  toggleBaseTheme(value: BaseTheme): void {
    this.data.base = value;
  }

  toggleAccentTheme(value: AccentTheme): void {
    this.data.accent = value;
  }
}
