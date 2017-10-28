import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AppStorageData } from '../../app/app.component';
import { Storage } from '../../app/core/Storage';


@IonicPage()
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage:Storage,
              public menuCtrl: MenuController) {

    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
  }

  ionViewWillEnter() {
    this.storage.getItem(Storage.APP_ID).then((value) => {
      this.data = <AppStorageData>value;
    }).catch((reject) => {
      console.log("app-settings storage error")
    });
  }

  _data: AppStorageData;
  get data(): AppStorageData {
    return this._data;
  }
  set data(value: AppStorageData) {
    this._data = value;
  }
}
