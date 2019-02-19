/**
    AIT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

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
import { AfterViewInit, Component, ComponentFactoryResolver, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment as env } from 'src/environments/environment';

import { AppUtils } from './app.utils';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuService, SideMenuShapes, SideMenuStatusResponse } from './components/side-menu/side-menu.service';
import { HomePage } from './pages/home/home.page';
import { ScreenService } from './services/screen.service';
import { StorageDefaultData } from './services/storage/ait-storage.defaultdata';
import { AITStorage } from './services/storage/ait-storage.service';
import { AppStorageData } from './services/storage/ait-storage.shapes';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('startMenu')
  startMenu: SideMenuComponent;

  @ViewChild('endMenu')
  endMenu: SideMenuComponent;

  /**
   * The css app theme that `this.watchTheme()` provides updates
   */
  theme: string;

  /**
   * Enables or disables sidemenus from being cached by `SideMenuComponent`.
   */
  cacheSideMenus = env.enableViewCache;

  /**
   * To be used momentary to disable interaction
   */
  isContentInteractive: boolean;

  private appSubjet: BehaviorSubject<AppStorageData>;

  constructor(
    private platform: Platform,
    private router: Router,
    protected injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private storage: AITStorage,
    private screenSvc: ScreenService,
    private menuSvc: SideMenuService
  ) { }

  ngOnInit(): void {
    this.initializeApp();
  }

  ngAfterViewInit(): void {
    this.subscribeMenuService();
  }

  private subscribeMenuService(): void {
    this.menuSvc.listen({
      next: (note: SideMenuShapes): void => {
        if ('response' in note) {
          note = note as SideMenuStatusResponse;

          // during app start-up; after end sidemenu has been loaded
          if ((note.subject === 'start') &&
            (note.response === false)) {

            const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(HomePage);
            this.menuSvc.send({
              subject: 'start',
              uuid: StorageDefaultData.HOME_ID,
              request: 'load',
              component: resolvedComponent,
              injector: this.injector
            });

            // post app start-up; after start and end sidemenus have been loaded
          } else if ((note.subject === 'start') &&
            (note.response === true) &&
            (this.screenSvc.isSplashHidden() === false)) {

            this.isContentInteractive = false;
            this.screenSvc.bootupScreen()
              .then(() => {
                // TODO: delay here for animating navigation away is completed. Angular or Cordova
                // or Ionic, seems to not be fully completed. And will lock navigation to sidemenu
                // or cause both sidemenus on the same side.
                AppUtils.delayPromise(2000).then(() => this.isContentInteractive = true);
              });
            this.platform.resume.subscribe(() => {
              // TODO: in an unlikely event, this perhaps can be used. That is, if the user has
              // display in running state when they set ait to the device's background and then
              // returns. At that point this may be called.
              // this.brightness.applyBrightnessOffset();
            });
          }
        }
      }
    });
  }

  private initializeApp(): void {
    this.platform.ready()
      .then(async () => {

        this.appSubjet = await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID);

        let startroute: string[];
        this.appSubjet.subscribe((appdata) => {
          this.applyTheme(appdata);
          startroute = AppUtils.convertToStartupRoute(appdata);
        });

        this.router.navigate(startroute);
      });
  }

  private applyTheme(value: AppStorageData): void {
    // TODO: I attempted to subscribe with distinctUntilChanged() but that failed, hence
    // comparison below
    const theme = AppUtils.getCombinedTheme(value);
    if (theme.startsWith('theme-dark')) {
      this.theme = 'theme-dark';
    } else {
      this.theme = 'theme-light';
    }
  }
}
