/*
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
import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { error, AppUtils } from './app.utils';
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
export class AppComponent implements OnInit {
  /**
   * The css app theme that `this.watchTheme()` provides updates
   */
  theme: string;

  private isStartUp: boolean;

  /**
   * To be used momentary to disable interaction
   */
  areSideMenusInteractive: boolean;

  private appSubjet: BehaviorSubject<AppStorageData>;

  constructor(
    private platform: Platform,
    private router: Router,
    protected injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private storage: AITStorage,
    private screenSvc: ScreenService,
    private menuSvc: SideMenuService
  ) {
    this.areSideMenusInteractive = false;
    this.isStartUp = true;
  }

  ngOnInit(): void {
    this.initializeApp();
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

          } else if ((note.subject === 'start') &&
            (note.response === true) &&
            (this.isStartUp === true)) {

            this.isStartUp = false;
            this.screenSvc.bootupScreen()
              .catch((reason) => {
                error(reason);
              });
          } else if (note.subject === '*') {
            this.areSideMenusInteractive = true;
          }
        }
      }
    });
  }

  private initializeApp(): void {
    this.platform.ready()
      .then(async () => {
        let appSubjetUUID: string;

        this.appSubjet = await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID);

        let startroute: string[];
        this.appSubjet.subscribe((appdata) => {
          appSubjetUUID = appdata.uuid;
          this.applyTheme(appdata);
          startroute = AppUtils.convertToStartupRoute(appdata);
        });

        // Set our navigation extras object
        // that contains our global query params and fragment
        const navigationExtras: NavigationExtras = {
          queryParams: { 'isStartUp': true }
        };

        this.subscribeMenuService();

        // launch last known page...
        await this.router.navigate(startroute, navigationExtras);
      });

    this.platform.resume.subscribe(() => {
      this.screenSvc.immersiveMode();
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
