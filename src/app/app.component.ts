import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

import { MenuItemComponent } from './components/menu-item.component';
import { MenuItemService } from './components/menu-item.service';
import { StorageDefaultData } from './providers/storage/ait-storage.defaultdata';
import { AppStorageData } from './providers/storage/ait-storage.interfaces';
import { AITStorage } from './providers/storage/ait-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('startMenu')
  startMenu: MenuItemComponent;

  @ViewChild('endMenu')
  endMenu: MenuItemComponent;

  data: AppStorageData;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: AITStorage,
    private menuService: MenuItemService
  ) {
  }

  ngOnInit(): void {
    this.menuService.subscribe(() => {
      console.log('ngOnInit');
    });

    this.initializeApp();
  }

  ngAfterViewInit(): void {

  }

  async initializeApp() {
    const linkparams = await this.getStartupRoute();

    await this.platform.ready()
      .then(() => {
        // TODO: apply theme here with  this.data
        this.statusBar.styleDefault();
        return this.router.navigate(linkparams)
          .then((value) => {
            if (value) {
              this.splashScreen.hide();
            }
          });
      });
  }

  async getStartupRoute(): Promise<any> {
    return await this.storage.getPagePromise<AppStorageData>(StorageDefaultData.APP_ID)
      .then((value) => {
        if (value) {
          this.data = value;
          return ['/' + StorageDefaultData.getPageNameByID(value.current_uuid), value.current_uuid];
        }
      });
  }
}
