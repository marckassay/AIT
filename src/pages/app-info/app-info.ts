/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
