/**
    AiT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

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
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { XProgressBarComponent } from 'src/app/components/x-progress-bar/x-progress-bar.component';
import { BrightnessUtil, ScreenService } from 'src/app/services/screen.service';
import { SignalService } from 'src/app/services/signal.service';
import { StorageDefaultData } from 'src/app/services/storage/ait-storage.defaultdata';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';
// tslint:disable-next-line:max-line-length
import { AccentTheme, AppStorageData, BaseTheme, BrightnessSet, OrientationSetting, VolumeSet } from 'src/app/services/storage/ait-storage.shapes';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss']
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

  @ViewChild(XProgressBarComponent)
  protected progress: XProgressBarComponent;
  /**
   * this type assignment to variable is for Angular template can access enum values.
   */
  protected BT = BaseTheme;
  protected AT = AccentTheme;
  protected OR = OrientationSetting;

  /**
   * since the 'remember device volume' toggle can be disabled and checked simultaneously or
   * enabled and unchecked, this property is to do logic to determine if `data.sound` is
   * truthly or not.
   */
  isVolToggleChecked: boolean;

  absoluteVolumeValue: VolumeSet;

  /**
   * although BrightnessSet value may be below zero, the UI is constrained to 10 and above. so this
   * property conforms to that contraint.
   */
  absoluteBrightnessValue: BrightnessSet;

  private appSubjt: BehaviorSubject<AppStorageData>;

  constructor(
    protected changeRef: ChangeDetectorRef,
    protected menuCtrl: MenuController,
    protected signalSvc: SignalService,
    protected screenSvc: ScreenService,
    protected storage: AITStorage
  ) { }

  ngOnInit(): void {
    this.progress.show();
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
    this.progress.hide();
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  ionViewWillLeave(): void {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  ngOnDestroy(): void {
    // since the user may have adjusted the volume while the 'remember volume' was enabled, we
    // need to check to ensure that the volume is updated
    if (this.data.sound > 0) {
      this.signalSvc.storeVolume();
    }
    this.next();
  }

  private subscribe(): void {
    const appSubsn = this.appSubjt.subscribe((value) => {
      this.data = value;
    });
    appSubsn.unsubscribe();

    this.isVolToggleChecked = this.data.sound > 0;
    this.absoluteVolumeValue = Math.abs(this.data.sound) as VolumeSet;
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
      this.signalSvc.storeVolume();
    } else if (Math.abs(this.data.sound) > 0) {
      this.data.sound = 0;
      this.next();
    }
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
  * The range UI for 'remember volume value' toggle.
  */
  rangeVolumeValue(event: CustomEvent): void {
    this.data.sound = (event.detail.value as VolumeSet);
    this.next();
    this.signalSvc.double();
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
