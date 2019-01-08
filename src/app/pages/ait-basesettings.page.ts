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
import { ChangeDetectorRef, Optional, AfterContentInit } from '@angular/core';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { AppStorageData, UUIDData, StorePair } from '../providers/storage/ait-storage.interfaces';
import { StorageDefaultData } from '../providers/storage/ait-storage.defaultdata';
import { ToastController } from '@ionic/angular';

export class AITBaseSettingsPage implements AfterContentInit {
  /**
   * This is set by AITBasePage.createSettingsPage() when component is instantiated.
   */
  public uuid: string;

  _uuidDat: UUIDData;
  get uuidDat(): UUIDData {
    return this._uuidDat;
  }
  set uuidDat(value: UUIDData) {
    this._uuidDat = value;
  }

  protected store_app: StorePair<UUIDData>;
  protected store: StorePair<UUIDData>;

  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;
  protected isFirstViewing: boolean;

  constructor(@Optional() protected ngDectector: ChangeDetectorRef,
    @Optional() protected storage: AITStorage,
    @Optional() protected toastCtrl: ToastController,
  ) { }

  /**
   * Caller is `rightmenu` when it emits a `ionOpen` event. This component resides in `AITBasePage`.
   */
  loadAppData(): void {
    this.store_app = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID);

    this.store_app.promise.then((value: AppStorageData) => {
      this.appSoundsDisabled = value.sound === 0;
      this.appVibratorDisabled = !value.vibrate;

      this.ngDectector.detectChanges();
    });
  }

  ngAfterContentInit() { this.loadViewData(); }

  private loadViewData(): void {
    this.store = this.storage.getPagePromiseAndSubject2<UUIDData>(this.uuid);

    this.store.promise.then((value: UUIDData) => {
      this.uuidDat = value;
    });
  }

  protected dataChanged(): void {
    this.ngDectector.detectChanges();
    this.store.subject.next(this.uuidDat);
  }

  protected inform(): void {
    let bmesg = (this.appSoundsDisabled) ? 1 : 0;
    bmesg += (this.appVibratorDisabled) ? 2 : 0;
    bmesg += (bmesg === 3) ? 4 : 0;

    let smesg: string;
    if (bmesg === 1) {
      smesg = 'sound is muted';
    } else if (bmesg === 2) {
      smesg = 'vibrate is turned-off';
    } else {
      smesg = 'sound is muted and vibrate is turned-off';
    }
    // TODO: toast
    /*
    const toast = this.toastCtrl.create({
      message: 'AiT\'s ' + smesg + '. Go to \'AiT Settings\' page and adjust accordingly if needed.',
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top'
    });

    toast.present(); */
  }
}
