import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Interval Display',
      url: '/interval',
      icon: 'home'
    },
    {
      title: 'Timer Display',
      url: '/timer',
      icon: 'list'
    },
    {
      title: 'Stopwatch Display',
      url: '/stopwatch',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const page = await this.getLastPage();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.router.navigate(['/' + page]);
      this.splashScreen.hide();
    });
  }

  getLastPage() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('interval');
      }, 1000);
    });
  }
}
