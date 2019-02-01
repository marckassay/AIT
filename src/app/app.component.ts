import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AppUtils } from './app.utils';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuRequest, SideMenuService } from './components/side-menu/side-menu.service';
import { HomePage } from './pages/home/home.page';
import { StorageDefaultData } from './services/storage/ait-storage.defaultdata';
import { AITStorage } from './services/storage/ait-storage.service';
import { AppStorageData } from './services/storage/ait-storage.shapes';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('startMenu')
  startMenu: SideMenuComponent;

  @ViewChild('endMenu')
  endMenu: SideMenuComponent;

  /**
   * The css app theme that `themer` provides via Observable
   */
  theme: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private storage: AITStorage,
    private menuSvc: SideMenuService
  ) { }

  ngOnInit(): void {
    this.subscribeMenuService();
    this.initializeApp();
  }

  ngAfterViewInit(): void {

  }

  private subscribeMenuService(): void {
    this.menuSvc.subscribe((note) => {
      if (note as SideMenuRequest) {
        note = note as SideMenuRequest;
        // if received a note on start menu's status, be nice and respond with a response. And
        // immediately followed by a request to load start menu if status is 'unloaded'.
        if ((note.subject === 'start') && (note.request === 'status')) {
          const homeMenuStatus = (this.startMenu.isComponentLoaded(StorageDefaultData.HOME_ID)) ? 'loaded' : 'unloaded';
          this.menuSvc.next({ subject: 'start', uuid: StorageDefaultData.HOME_ID, response: homeMenuStatus });

          if (homeMenuStatus === 'unloaded') {
            const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(HomePage);
            this.menuSvc.next({ subject: 'start', uuid: StorageDefaultData.HOME_ID, request: 'load', component: resolvedComponent });
          }
        }
      }
    });
  }

  async initializeApp(): Promise<void> {
    await this.platform.ready()
      .then(async () => {
        const appsubject = await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID);
        let startroute: string[];
        appsubject.subscribe((appdata) => {
          startroute = AppUtils.convertToStartupRoute(appdata);
        });
        this.watchTheme(appsubject);

        this.statusBar.styleDefault();

        return this.router.navigate(startroute)
          .then((value) => {
            if (value) {
              this.splashScreen.hide();
            }
          });
      });

    this.platform.resume.subscribe(() => {
      // TODO: in an unlikely event, this perhaps can be used. That is, if the user has display in
      // running state when they set ait to the device's background and then returns. At that point
      // this may be called.
      // this.brightness.applyBrightnessOffset();
    });
  }

  private watchTheme(data: BehaviorSubject<AppStorageData>): void {
    data.pipe(
      debounceTime(1000),
      distinctUntilChanged<AppStorageData>((a, b) => {
        return (a.base === b.base || a.accent === b.accent);
      })
    ).subscribe((value) => {
      this.theme = AppUtils.getCombinedTheme(value);
    });
  }
}
