import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IonicPage, MenuController, ToastController } from 'ionic-angular';
import * as app from '../../app/app.component';
import { AITStorage } from '../../app/core/AITStorage';
import { AppStorageData, IntervalStorageData } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class IntervalSettingsPage implements OnInit {
  uuid: string;
  appSoundsDisabled: boolean;
  appVibratorDisabled: boolean;

  constructor(public storage: AITStorage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public ngDectector: ChangeDetectorRef) { }

  initialize(uuid: string): void {
    this.uuid = uuid;
    this.menuCtrl.get('right').ionOpen.subscribe(() => {
      this.loadTimerData(uuid);
      this.storage.getItem(AITStorage.APP_ID).then((value) => {
        this.appSoundsDisabled = !(value as AppStorageData).sound;
        this.appVibratorDisabled = !(value as AppStorageData).vibrate;

        // need this to refresh the view.
        this.ngDectector.detectChanges();
      });
    });
  }

  ngOnInit() {
    // load data now, to prevent white flash when initially opened...
    this.loadTimerData(this.uuid);
  }

  loadTimerData(uuid: string): void {
    this.storage.getItem(uuid).then((value) => {
      this.data = (value as IntervalStorageData);

      // need this to refresh the view.
      this.ngDectector.detectChanges();
    });
  }
  get totaltime(): string {
    if (this.data) {
      const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return app.getRemainingTimeISO(totaltimeInSeconds * app.millisecond);
    } else {
      return '00:00.0';
    }
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':0';
    }
  }

  dataChanged(property?: string): void {
    property!;
    this.ngDectector.detectChanges();

    this.storage.setItem(this.data);
  }

  inform(): void {
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

  _data: IntervalStorageData;
  get data(): IntervalStorageData {
    return this._data;
  }
  set data(value: IntervalStorageData) {
    this._data = value;
  }
}
