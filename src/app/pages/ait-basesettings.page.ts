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
import { AfterContentInit, Optional } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { UUIDData } from '../services/storage/ait-storage.interfaces';
import { AITStorage } from '../services/storage/ait-storage.service';

export class AITBaseSettingsPage implements AfterContentInit {
  _uuid: string;
  get uuid(): string {
    return this._uuid;
  }
  set uuid(value: string) {
    this._uuid = value;
  }

  protected _subject: BehaviorSubject<UUIDData>;
  protected get subject(): BehaviorSubject<UUIDData> {
    return this._subject;
  }
  protected set subject(value: BehaviorSubject<UUIDData>) {
    this._subject = value;
    this.initsub();
  }

  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;

  constructor(
    @Optional() protected storage: AITStorage,
    @Optional() protected toastCtrl: ToastController,
  ) { }

  ngAfterContentInit() {
    this.storage.getPromiseSubject(this.uuid).then((value) => {
      this.subject = value;
    });
  }

  private initsub() {
    this.subject.subscribe((value) => {
      console.log('initsub', value.uuid);
      // this.appSoundsDisabled = value.sound === 0;
      // this.appVibratorDisabled = !value.vibrate;
    });
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
