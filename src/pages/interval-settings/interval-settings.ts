import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { IonicPage, MenuController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AITStorage } from '../../app/core/AITStorage';
import { IntervalStorageData } from '../../app/app.component';
import { AITBaseSettingsPage } from '../AITBaseSettingsPage';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class IntervalSettingsPage extends AITBaseSettingsPage {
  _data: IntervalStorageData;
  get data(): IntervalStorageData {
    return this._uuidData as IntervalStorageData;
  }
  set data(value: IntervalStorageData) {
    this._uuidData = value;
  }

  constructor(public storage: AITStorage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public ngDectector: ChangeDetectorRef) {
    super(storage,
      menuCtrl,
      toastCtrl,
      ngDectector);
  }

  get totaltime(): string {
    if (this.data) {
      const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return moment(totaltimeInSeconds * 1000).format('mm:ss.S');
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
}
