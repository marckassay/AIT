import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BrightnessUtil, ScreenService } from 'src/app/services/screen.service';
import { SignalService } from 'src/app/services/signal.service';
import { StorageDefaultData } from 'src/app/services/storage/ait-storage.defaultdata';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';
import { AppStorageData, BrightnessSet } from 'src/app/services/storage/ait-storage.shapes';
import { AccentTheme, BaseTheme } from 'src/app/services/theme.service';

/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettingsPage implements OnInit, OnDestroy {
  readonly uuid = StorageDefaultData.APP_ID;

  private appSubject: BehaviorSubject<AppStorageData>;
  appSub: Subscription;

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
          this.appSubject = value;
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
    this.appSub.unsubscribe();
  }

  private subscribe() {
    this.appSub = this.appSubject.subscribe((value) => {
      this.data = value;
      this.absoluteBrightnessValue = BrightnessUtil.absolute(this.data.brightness);
      this.soundToggleWillEnter = (this.data.sound !== 0);
      this.soundRememberToggleWillEnter = this.data.sound > 0;
    });
  }

  toggleSound(): void {
    /*     if (this.data.sound === 0) {
          this.signal.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
            .then(() => {
              this.signal.audioman.getVolume(AudioManagement.VolumeType.MUSIC, (result) => { this.data.sound = result.volume; });
            });
        } else if (Math.abs(this.data.sound) > 0) {
          this.data.sound = 0;
        } */
  }

  /**
   * The UI for this event handler is only enabled when: `Math.abs(this.data.sound) > 0`.
   */
  testVolume(): void {
    /*     this.signal.audioman.getVolume(AudioManagement.VolumeType.MUSIC, (result) => {
          this.data.sound = result.volume;
          this.signal.double();
        }); */
  }

  /**
   * This UI is only enabled when: `Math.abs(this.data.sound) > 0`. And it simply will reverse the
   * sign of `this.data.sound` to indicate that a value of less than 0 disables this
   * "remember volume" feature, while a sign of greater than 0 enables it.
   */
  toggleRememberVolume(): void {
    if (this.data.sound !== 0) {
      this.data.sound = (this.data.sound * -1);
    }
  }

  toggleRememberBrightness(): void {
    this.data.brightness = BrightnessUtil.reverseSign(this.data.brightness);
  }

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
