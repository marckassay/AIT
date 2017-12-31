import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { Navbar } from 'ionic-angular/navigation/nav-interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-app-info',
  templateUrl: 'app-info.html',
})
export class AppInfoPage {
  @ViewChild('Navbar')
  nav: Navbar;

  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController,
    private iab: InAppBrowser) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
  }

  launchInfoSite() {
    this.iab.create('https://github.com/marckassay/AIT/blob/master/README.md', '_system');
  }

  navBack() {
    this.navCtrl.pop();
  }
}
