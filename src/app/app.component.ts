import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuRequest, SideMenuService } from './components/side-menu/side-menu.service';
import { HomePage } from './pages/home/home.page';
import { StorageDefaultData } from './providers/storage/ait-storage.defaultdata';
import { AppStorageData } from './providers/storage/ait-storage.interfaces';
import { AITStorage } from './providers/storage/ait-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('startMenu')
  startMenu: SideMenuComponent;

  @ViewChild('endMenu')
  endMenu: SideMenuComponent;

  data: AppStorageData;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private storage: AITStorage,
    private menuService: SideMenuService
  ) { }

  ngOnInit(): void {
    this.menuService.subscribe((note) => {
      if ((note as SideMenuRequest).request !== undefined) {
        note = note as SideMenuRequest;
        if ((note.subject === 'start') && (note.request === 'status')) {
          console.log('app', 3, 'received request to be loaded');
          const menuStatus = (this.startMenu.hasBeenLoaded) ? 'loaded' : 'unloaded';
          console.log('app', 4, 'responding with status of:', menuStatus);
          this.menuService.next({ subject: 'start', response: menuStatus });
          if (menuStatus === 'unloaded') {
            console.log('app', 5, 'requesting to be loaded');
            const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(HomePage);
            this.menuService.next({ subject: 'start', request: 'load', component: resolvedComponent });
          }
        }
      }
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
