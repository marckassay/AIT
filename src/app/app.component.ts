import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { AppUtils } from './app.utils';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuRequest, SideMenuService } from './components/side-menu/side-menu.service';
import { HomePage } from './pages/home/home.page';
import { StorageDefaultData } from './services/storage/ait-storage.defaultdata';
import { AppStorageData } from './services/storage/ait-storage.interfaces';
import { AITStorage } from './services/storage/ait-storage.service';
import { ThemeService } from './services/theme.service';

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
    private themer: ThemeService,
    private storage: AITStorage,
    private menuService: SideMenuService
  ) { }

  ngOnInit(): void {
    this.subscribeMenuService();
    this.initializeApp();
  }

  ngAfterViewInit(): void {

  }

  private subscribeMenuService(): void {
    this.menuService.subscribe((note) => {
      if ((note as SideMenuRequest).request !== undefined) {
        note = note as SideMenuRequest;
        // if received a note on start menu's status, be nice and respond with a response. And
        // immediately followed by a request to load start menu if needed.
        if ((note.subject === 'start') && (note.request === 'status')) {
          const menuStatus = (this.startMenu.hasBeenLoaded) ? 'loaded' : 'unloaded';
          this.menuService.next({ subject: 'start', response: menuStatus });

          if (menuStatus === 'unloaded') {
            const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(HomePage);
            this.menuService.next({ subject: 'start', request: 'load', component: resolvedComponent });
          }
        }
      }
    });
  }

  async initializeApp(): Promise<void> {
    await this.platform.ready()
      .then(async () => {
        const data = await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID);
        let startroute: string[];
        const appsubscrip = data.subscribe((appval) => {
          startroute = AppUtils.convertToStartupRoute(appval);
        });
        appsubscrip.unsubscribe();

        this.initializeThemer(data);
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

  private initializeThemer(data: BehaviorSubject<AppStorageData>): void {
    this.themer.app = data;
    this.themer.theme$().subscribe((value: string) => this.theme = value);
  }
}
