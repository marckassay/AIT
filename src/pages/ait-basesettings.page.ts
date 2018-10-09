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
import { ChangeDetectorRef, OnInit, Optional, AfterContentInit } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { AppStorageData, UUIDData } from '../providers/storage/ait-storage.interfaces';

export class AITBaseSettingsPage implements OnInit, AfterContentInit {
  // set by app.component when component is instantiated
  public uuid: string;

  _uuidData: UUIDData;
  get uuidData(): UUIDData {
    return this._uuidData;
  }
  set uuidData(value: UUIDData) {
    this._uuidData = value;
  }

  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;
  protected isFirstViewing: boolean;

  constructor(@Optional() protected ngDectector: ChangeDetectorRef,
    @Optional() protected storage: AITStorage,
    @Optional() protected toastCtrl: ToastController,
  ) { }

  loadAppData(): void {
    this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {
      this.appSoundsDisabled = !(value as AppStorageData).sound;
      this.appVibratorDisabled = !(value as AppStorageData).vibrate;

      this.ngDectector.detectChanges();
    });
  }

  // leave open for subclasses
  ngOnInit() { }

  ngAfterContentInit() {
    this.loadViewData();
  }

  private loadViewData(): void {
    this.storage.getItem(this.uuid).then((value: UUIDData) => {
      this.uuidData = value;
    });
  }

  protected dataChanged(): void {
    this.ngDectector.detectChanges();

    this.storage.setItem(this.uuidData);
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

    let toast = this.toastCtrl.create({
      message: 'AiT\'s ' + smesg + '. Go to \'AiT Settings\' page and adjust accordingly if needed.',
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top'
    });

    toast.present();
  }
}
