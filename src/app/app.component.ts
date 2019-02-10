/**
    AiT - Another Interval Timer
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
import { debounceTime, skip } from 'rxjs/operators';

import { AppUtils } from './app.utils';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SideMenuService, SideMenuStatusRequest, SideMenuStatusResponse } from './components/side-menu/side-menu.service';
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
    this.menuSvc.subscribe((note) => {
      if ('request' in note) {

        // if received a note on start menu's status call is isComponentAttached(). if false is
        // returned, request to load start menu
        if ((note.subject === 'start') && (note.request === 'status')) {
          note = note as SideMenuStatusRequest;
          const homeMenuStatus = (this.startMenu.isComponentAttached(StorageDefaultData.HOME_ID));

          if (homeMenuStatus === false) {
            const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(HomePage);
            this.menuSvc.next({
              subject: 'start',
              uuid: StorageDefaultData.HOME_ID,
              request: 'load',
              component: resolvedComponent,
              injector: this.injector
            });
          }
        }
      } else if ('response' in note) {
        note = note as SideMenuStatusResponse;

        // post app start-up; after start and end sidemenus have been loaded
        if ((note.subject === 'start') && (note.response)) {
          this.screenSvc.bootupScreen();
          this.platform.resume.subscribe(() => {
            // TODO: in an unlikely event, this perhaps can be used. That is, if the user has display in
            // running state when they set ait to the device's background and then returns. At that point
            // this may be called.
            // this.brightness.applyBrightnessOffset();
          });
        }
      }
    });
  }

  private initializeApp(): void {
    this.platform.ready()
      .then(async () => {
        const appsubject = await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID);

        let startroute: string[];
        appsubject.subscribe((appdata) => {
          this.applyTheme(appdata);
          startroute = AppUtils.convertToStartupRoute(appdata);
        });
        this.watchTheme(appsubject);

        this.router.navigate(startroute);
      });
  }

  private watchTheme(data: BehaviorSubject<AppStorageData>): void {
    data.pipe(
      skip(1),
      debounceTime(1000)
    ).subscribe((value) => {
      this.applyTheme(value);
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
