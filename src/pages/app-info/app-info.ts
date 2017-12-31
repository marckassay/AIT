import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { Navbar } from 'ionic-angular/navigation/nav-interfaces';

@IonicPage()
@Component({
  selector: 'page-app-info',
  templateUrl: 'app-info.html',
})
export class AppInfoPage {
  @ViewChild('Navbar')
  nav: Navbar;

  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');
  }

  launchInfoSite() {

  }

  navBack() {
    this.navCtrl.pop();
  }
}
