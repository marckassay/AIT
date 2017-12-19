import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AppStorageData } from '../../app/app.component';
import { AITStorage } from '../../app/core/AITStorage';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from '../../app/core/ThemeSettingsProvider';
import { Navbar } from 'ionic-angular/navigation/nav-interfaces';
import { AITSignal } from '../../app/core/AITSignal';


@IonicPage()
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {
  @ViewChild('Navbar')
  nav: Navbar;

  BaseTheme = BaseTheme;
  AccentTheme = AccentTheme;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: AITStorage,
    public signal: AITSignal,
    public settings: ThemeSettingsProvider,
    public menuCtrl: MenuController) {

    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
  }

  ionViewWillEnter() {
    this.storage.getItem(AITStorage.APP_ID).then((value) => {
      this.data = value as AppStorageData;
    }).catch(() => {
      // console.log("app-settings storage error");
    });
  }

  ionViewWillLeave() {
    this.storage.setItem(this.data);
    this.signal.data = this.data;
  }

  toggleBaseTheme(value: BaseTheme) {
    this.settings.base = value;
    this._data.base = value;
  }

  toggleAccentTheme(value: AccentTheme) {
    this.settings.accent = value;
    this._data.accent = value;
  }

  _data: AppStorageData;
  get data(): AppStorageData {
    return this._data;
  }
  set data(value: AppStorageData) {
    this._data = value;
  }

  navBack() {
    this.navCtrl.pop();
  }
}
