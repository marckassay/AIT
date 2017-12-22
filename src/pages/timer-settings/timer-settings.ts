import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { IonicPage, MenuController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AITStorage } from '../../app/core/AITStorage';
import { TimerStorageData } from '../../app/app.component';
import { AITBaseSettingsPage } from '../AITBaseSettingsPage';
import { Moment } from 'moment';

@IonicPage()
@Component({
  selector: 'page-timer-settings',
  templateUrl: 'timer-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class TimerSettingsPage extends AITBaseSettingsPage {
  @Input('data')
  get data(): TimerStorageData {
    return this._uuidData as TimerStorageData;
  }
  set data(value: TimerStorageData) {
    this._uuidData = value;
  }

  grandTime: { minutes: number, seconds: number };

  constructor(public storage: AITStorage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public ngDectector: ChangeDetectorRef) {
    super(storage,
      menuCtrl,
      toastCtrl,
      ngDectector);
    this.grandTime = { minutes: 15, seconds: 0 };
  }

  // _formattedGrandTime: string;
  get formattedGrandTime(): string {
    if (this.data) {
      const time: Moment = moment(this.data.time * 1000);
      return time.format('mm:ss.S');
    }
    return '';
  }
  /*   set formattedGrandTime(value: string) {
      this._formattedGrandTime = value;
    } */

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':10';
    }
  }

  protected dataChanged(property?: string): void {
    property!;
    this.data.time = (this.grandTime.minutes * 60) + this.grandTime.seconds;



    this.storage.setItem(this.data);

    this.ngDectector.detectChanges();
  }
}
