import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { IonicPage, MenuController, ToastController } from 'ionic-angular';
import { AITStorage } from '../../app/core/AITStorage';
import { AppStorageData } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-timer-settings',
  templateUrl: 'timer-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class TimerSettingsPage {
  appVibratorDisabled: boolean;
  appSoundsDisabled: boolean;
  uuid: string;

  constructor(public storage: AITStorage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public ngDectector: ChangeDetectorRef) {

  }

  initialize(uuid: string): void {
    this.uuid = uuid;
    this.menuCtrl.get('right').ionOpen.subscribe(() => {
      // this.loadTimerData(uuid);
      this.storage.getItem(AITStorage.APP_ID).then((value) => {
        this.appSoundsDisabled = !(value as AppStorageData).sound;
        this.appVibratorDisabled = !(value as AppStorageData).vibrate;

        // need this to refresh the view.
        this.ngDectector.detectChanges();
      });
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerSettingsPage');
  }

}
