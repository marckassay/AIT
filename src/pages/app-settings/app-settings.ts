import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AppStorageData } from '../../app/app.component';
import { AITStorage } from '../../app/core/AITStorage';
import { ThemeSettingsProvider } from '../../app/core/ThemeSettingsProvider';
import { Navbar } from 'ionic-angular/navigation/nav-interfaces';


@IonicPage()
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {
  @ViewChild("Navbar")
  nav: Navbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage:AITStorage,
              public settings: ThemeSettingsProvider,
              public menuCtrl: MenuController) {

    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
  }

  ionViewWillEnter() {
    this.storage.getItem(AITStorage.APP_ID).then((value) => {
      this.data = <AppStorageData>value;
    }).catch((reject) => {
      //console.log("app-settings storage error");
    });
  }

  ionViewWillLeave()
  {
    this.storage.setItem(this.data);
  }

  toggleLightTheme(value: boolean) {
    if (value === true) {
      this.settings.setCombinedTheme('theme-light');
    } else {
      this.settings.setCombinedTheme('theme-dark');
    }

    this._data.lighttheme = value;
  }

  toggleAccentTheme(value: string) {
    switch (value) {
      case 'md-500-rgb':

        break;

      default:
        break;
    }
  }

  _data: AppStorageData;
  get data(): AppStorageData {
    return this._data;
  }
  set data(value: AppStorageData) {
    this._data = value;
  }
}
