/*
    AIT - Another Interval Timer
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
import { AfterContentInit, AfterViewInit, Injector, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { error } from '../app.utils';
import { OnClosed, SideMenuService } from '../components/side-menu/side-menu.service';
import { StorageDefaultData } from '../services/storage/ait-storage.defaultdata';
import { AITStorage } from '../services/storage/ait-storage.service';
import { AppStorageData, UUIDData } from '../services/storage/ait-storage.shapes';



export class SettingsPage implements OnInit, AfterContentInit, AfterViewInit, OnClosed, OnDestroy {
  private _uuid: string;
  get uuid(): string {
    return this._uuid;
  }
  set uuid(value: string) {
    this._uuid = value;
  }

  private _injector: Injector;
  get injector(): Injector {
    return this._injector;
  }
  set injector(value: Injector) {
    this._injector = value;
  }

  private appSubject: BehaviorSubject<AppStorageData>;
  private pageSubject: BehaviorSubject<UUIDData>;

  // note that this object exists in the display-page instance too. so any changes here will be
  // reflect instantly in the display-page.
  protected uuidData: UUIDData;

  // TODO: move inform logic to util
  protected showInform: boolean;
  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;

  private storage: AITStorage;
  private toastCtrl: ToastController;
  private menuSvc: SideMenuService;

  constructor() { }

  ngOnInit(): void {
    this.storage = this.injector.get<AITStorage>(AITStorage);
    this.toastCtrl = this.injector.get<ToastController>(ToastController);
    this.menuSvc = this.injector.get<SideMenuService>(SideMenuService);
  }

  ngAfterContentInit(): void {
    const getPromiseSubject = async (): Promise<void> => {
      await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
        .then((value) => {
          this.appSubject = value;
        });

      await this.storage.getPromiseSubject(this.uuid)
        .then((value) => {
          this.pageSubject = value;
        });

      this.subscribe();
    };
    getPromiseSubject();
  }

  ngAfterViewInit(): void {
    this.menuSvc.send({
      subject: 'end',
      uuid: this.uuid,
      response: true
    });
  }

  smOnClosed(): void {
    this.pageSubject.next(this.uuidData);
  }

  ngOnDestroy(): void {
    error('sidemenu ngOnDestroy()');
  }

  private subscribe(): void {
    this.appSubject.subscribe((value) => {
      this.appSoundsDisabled = value.sound === 0;
      this.appVibratorDisabled = value.vibrate === false;
      this.showInform = (this.appSoundsDisabled || this.appVibratorDisabled);
    });

    this.pageSubject.subscribe(value => this.uuidData = value);
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
      message: '\r\nAIT\'s ' + smesg + '. Go to \'AIT SETTINGS\' page to adjust vibrate and sound settings accordingly.',
      duration: 10000,
      showCloseButton: true,
      position: 'top'
    });

    toast.present();
  }
}
