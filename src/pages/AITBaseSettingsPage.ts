import { ChangeDetectorRef, OnInit } from '@angular/core';
import { MenuController, ToastController } from 'ionic-angular';
import { AITStorage } from '../app/core/AITStorage';
import { AppStorageData, UUIDData } from '../app/app.component';

export class AITBaseSettingsPage implements OnInit {
  _uuidData: UUIDData;
  get uuidData(): UUIDData {
    return this._uuidData;
  }
  set uuidData(value: UUIDData) {
    this._uuidData = value;
  }

  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;
  private uuid: string;

  constructor(public storage: AITStorage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public ngDectector: ChangeDetectorRef) {
  }

  ngOnInit() {
    // load data now, to prevent white flash when initially opened...
    this.loadTimerData();
  }

  // this gets called from app.component.ts...
  initialize(uuid: string): void {
    this.uuid = uuid;
    this.menuCtrl.get('right').ionOpen.subscribe(() => {
      this.loadTimerData();
      this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {
        this.appSoundsDisabled = !(value as AppStorageData).sound;
        this.appVibratorDisabled = !(value as AppStorageData).vibrate;

        // need this to refresh the view.
        this.ngDectector.detectChanges();
      });
    });
  }

  protected dataChanged(property?: string): void {
    property!;
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

  private loadTimerData(): void {
    this.storage.getItem(this.uuid).then((value: UUIDData) => {
      this.uuidData = value;

      // need this to refresh the view.
      this.ngDectector.detectChanges();
    });
  }
}
