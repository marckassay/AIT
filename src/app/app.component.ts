import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';

import { HomePage } from './pages/home/home.page';
import { RightMenuSubject } from './providers/right-menu-subject';
import { StorageDefaultData } from './providers/storage/ait-storage.defaultdata';
import { AppStorageData } from './providers/storage/ait-storage.interfaces';
import { AITStorage } from './providers/storage/ait-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild('leftMenuInnerHTML', { read: ViewContainerRef })
  leftMenuInnerHTML: ViewContainerRef;

  @ViewChild('rightMenuInnerHTML', { read: ViewContainerRef })
  rightMenuInnerHTML: ViewContainerRef;

  data: AppStorageData;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuCtrl: MenuController,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private storage: AITStorage,
    private rightMenuSubject: RightMenuSubject,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.rightMenuSubject.subscribe((page) => {
      this.createComponentForSideMenu(page);
      if (!this.leftMenuInnerHTML) {
        this.createComponentForSideMenu(HomePage);
      }
    });

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

  // TODO: would like to know preferred way to type this parameter. tried
  // 'typeof AITBaseSettingsPage | typeof HomePage'
  private createComponentForSideMenu(page: any) {
    let htmlElement: ViewContainerRef;
    console.log('createComponentForSideMenu', page);
    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory<any>(page);
    if (page instanceof HomePage === false) {
      htmlElement = this.rightMenuInnerHTML;
    } else {
      htmlElement = this.leftMenuInnerHTML;
    }
    htmlElement.clear();
    htmlElement.createComponent(resolvedComponent);
  }
}
