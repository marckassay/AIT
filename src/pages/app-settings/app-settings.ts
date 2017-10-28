import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AppStorageData } from '../../app/app.component';
import { Storage } from '../../app/core/Storage';
import { ThemeSettingsProvider } from '../../app/core/ThemeSettingsProvider';


@IonicPage()
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage:Storage,
              public settings: ThemeSettingsProvider,
              public menuCtrl: MenuController) {

    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
  }

  ionViewWillEnter() {
    console.log("app-settings - ionViewWillEnter")
    this.storage.getItem(Storage.APP_ID).then((value) => {
      this.data = <AppStorageData>value;
    }).catch((reject) => {
      console.log("app-settings storage error")
    });
  }

  toggleLightTheme(value: boolean) {
    if (value === true) {
      this.settings.setCombinedTheme('app-theme-light');
    } else {
      this.settings.setCombinedTheme('app-theme-dark');
    }

    this._data.lighttheme = value;
  }

  _data: AppStorageData;
  get data(): AppStorageData {
    return this._data;
  }
  set data(value: AppStorageData) {
    this._data = value;
  }
}
