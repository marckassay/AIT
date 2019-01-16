import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

import { StorageDefaultData } from './providers/storage/ait-storage.defaultdata';
import { AppStorageData } from './providers/storage/ait-storage.interfaces';
import { AITStorage } from './providers/storage/ait-storage.service';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from './providers/theme-settings.provider';

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

  combinedTheme: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private settings: ThemeSettingsProvider,
    private storage: AITStorage,
    private router: Router
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const page = await this.checkAppStartupData();

    await this.platform.ready()
      .then(() => {

        this.statusBar.styleDefault();
        return this.router.navigate(['/' + page])
          .then((value) => {
            if (value) {
              this.splashScreen.hide();
            }
          });
      });
  }

  async checkAppStartupData() {
    return await this.storage.getPagePromise<AppStorageData>(StorageDefaultData.APP_ID)
      .then((value) => {
        if (value) {
          this.settings.base = value.base as BaseTheme;
          this.settings.accent = value.accent as AccentTheme;

          this.settings.combinedTheme.subscribe((val: string) => {
            this.combinedTheme = val;
          });

          return StorageDefaultData.getPageNameByID(value.current_uuid);
        }
      });
  }


  /*   getLastPage() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('interval');
        }, 1000);
      });
    } */
}
