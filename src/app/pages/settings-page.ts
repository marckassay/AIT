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
import { AfterContentInit, Optional, SkipSelf } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { StorageDefaultData } from '../services/storage/ait-storage.defaultdata';
import { AITStorage } from '../services/storage/ait-storage.service';
import { AppStorageData, UUIDData } from '../services/storage/ait-storage.shapes';

export class SettingsPage implements AfterContentInit {
  _uuid: string;
  get uuid(): string {
    return this._uuid;
  }
  set uuid(value: string) {
    this._uuid = value;
  }

  private _appSubject: BehaviorSubject<AppStorageData>;
  private _pageSubject: BehaviorSubject<UUIDData>;

  // note that this object exists in the display-page instance too. so any changes here will be
  // reflect instantly in the display-page.
  protected _uuidData: UUIDData;
  protected grandTime: string;

  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;

  // TODO: not ideal place for these properties since used by a subclass. need to resolve
  // inhertience issue with missing injections.
  protected computedFactorValue = { lower: 10, upper: 100 };
  protected clonedForTenFactor: { [k: string]: any; } | undefined;
  protected clonedForOneFactor: { [k: string]: any; } | undefined;
  protected clonedForIntervalsFactor: number | undefined;
  protected clonedForCountdownFactor: number | undefined;

  constructor(
    @Optional() @SkipSelf() protected storage: AITStorage,
    @Optional() @SkipSelf() protected menuCtrl: MenuController,
    @Optional() @SkipSelf() protected toastCtrl: ToastController) { }

  ngAfterContentInit(): void {
    const getSubjects = async (): Promise<void> => {
      await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
        .then((value) => {
          this._appSubject = value;
        });

      await this.storage.getPromiseSubject(this.uuid)
        .then((value) => {
          this._pageSubject = value;
        });

      this.subscribe();
    };
    getSubjects();
  }

  private subscribe(): void {
    this._appSubject.subscribe((value) => {
      this.appSoundsDisabled = value.sound === 0;
      this.appVibratorDisabled = value.vibrate === false;
    });

    this._pageSubject.subscribe((value) => {
      this._uuidData = value;
    });

    this.menuCtrl.get('end').then((element) => {
      const menuClosed = (): void => {
        this._pageSubject.next(this._uuidData);
        // this._pageSubject.unsubscribe();
        // this._appSubject.unsubscribe();
        element.removeEventListener('ionDidClose', menuClosed);
      };

      element.addEventListener('ionDidClose', menuClosed);
    });
  }

  async inform(): Promise<void> {
    let bmesg = (this.appSoundsDisabled) ? 1 : 0;
    bmesg += (this.appVibratorDisabled) ? 2 : 0;
    bmesg += (bmesg === 3) ? 4 : 0;

    let smesg: string;
    if (bmesg === 1) {
      smesg = 'sound setting is disabled';
    } else if (bmesg === 2) {
      smesg = 'vibrate setting is disabled';
    } else {
      smesg = 'sound and vibrate settings are disabled';
    }

    const toast = await this.toastCtrl.create({
      message: 'AiT\'s ' + smesg + '. Go to \'AiT Settings\' page and adjust accordingly if needed.',
      duration: 10000,
      showCloseButton: true,
      position: 'top'
    });

    toast.present();
  }
}
