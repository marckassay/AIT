/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

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
import { ChangeDetectorRef, ComponentFactoryResolver, OnDestroy, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { FabAction, FabContainerComponent, FabEmission } from '../components/fab-container/fab-container';
import { AITBrightness } from '../providers/ait-screen';
import { AITSignal } from '../providers/ait-signal';
import { RightMenuSubject } from '../providers/right-menu-subject';
import { SotsForAit } from '../providers/sots/ait-sots';
import { SequenceStates } from '../providers/sots/ait-sots.util';
import { UUIDData } from '../providers/storage/ait-storage.interfaces';
import { AITStorage } from '../providers/storage/ait-storage.service';

import { AITBaseSettingsPage } from './ait-basesettings.page';

export class AITBasePage implements OnInit, OnDestroy {

  @ViewChild(FabContainerComponent)
  protected floatingbuttons: FabContainerComponent;

  uuidData$;

  protected _uuidData: UUIDData;
  get uuidData(): UUIDData {
    return this._uuidData;
  }
  set uuidData(value: UUIDData) {
    this._uuidData = value;
  }

  // this type assignment to variable is for angular view
  // can access enum values.
  SequenceStates = SequenceStates;
  // TODO: create a accessor and mutator and tie in FabContainerComponent viewState too. Perhaps
  // using a Subject would be better.
  protected viewState: SequenceStates;
  protected store: Observable<UUIDData>;
  protected sots: SotsForAit;
  protected grandTime: string;
  protected isFirstViewing: boolean;

  constructor(
    @Optional() protected componentFactoryResolver: ComponentFactoryResolver,
    @Optional() protected ngDectector: ChangeDetectorRef,
    @Optional() protected screenOrientation: ScreenOrientation,
    @Optional() protected storage: AITStorage,
    @Optional() @SkipSelf() public menuCtrl: MenuController,
    @Optional() protected signal: AITSignal,
    @Optional() protected display: AITBrightness,
    @Optional() protected splashScreen: SplashScreen,
    @Optional() protected statusBar: StatusBar,
    @Optional() protected router: Router,
    @Optional() protected route: ActivatedRoute,
    @Optional() protected rightMenuSubject: RightMenuSubject
  ) {
    console.log('ait-base ', 'constructor');
  }

  ngOnInit() {
    console.log('ait-base', 'ngOnInit');

    this.route.data
      .subscribe((data: { storage: UUIDData }) => {
        console.log(data.storage);
      });
  }

  ngOnDestroy(): void {
    console.log('ait-base', 'ngOnDestroy');
  }

  /**
   * Called by any of the subclasses settings page when `ionViewDidLoad` method is called by Ionic.
   *
   * @param settingsPage
   */
  protected createSettingsPage(settingsPage: typeof AITBaseSettingsPage): void {
    this.rightMenuSubject.next(settingsPage);
    // this.floatingbuttons.setProgramButtonToVisible();
  }

  /**
   * Runs when the page is about to enter and become the active page.
   */
  ionViewWillEnter(): void {
    this.aitLoadData();
  }

  /**
   * Runs when the page has fully entered and is now the active page. This event will fire, whether
   * it was the first load or a cached page.
   */
  ionViewDidEnter(): void {
    this.floatingbuttons.setToLoadedMode();
    this.floatingbuttons.setHomeButtonToVisible();
    this.floatingbuttons.setProgramButtonToVisible();

    this.setViewInRunningMode(false);
  }

  ionViewWillLeave(): void {
  }

  private aitLoadData(): void {

  }

  /**
   * A pre-check to prevent rebuilding timer when any irrelevant settings have changed from the
   * settings page. If the timer has been reset, it will be in its `SequenceStates.Loaded` state and
   * if countdown time setting has changed, it will return `true`. Other than data not being defined,
   * all others would been considered irrelevant in the `SequenceStates.Active` state and will
   * return `false`.
   *
   * @param value to be used to compare with existing UUIDData, if any.
   */
  protected aitPreBuildTimerCheck(value: UUIDData): boolean {
    throw new Error('Subclasses of AITBasePage need to implement aitPreBuildTimerCheck().' + value);
  }

  protected aitBuildTimer(): void {
    this.aitSubscribeTimer();
    this.aitResetTimer();
    this.aitPostBuildTimer();
  }

  protected aitSubscribeTimer(): void {
    throw new Error('Subclasses of AITBasePage need to implement aitSubscribeTimer().');
  }

  private aitResetTimer(): void {
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime({ time: -1 });
    this.sots.sequencer.reset();
    this.ngDectector.detectChanges();
  }

  protected aitPostBuildTimer(): void {
    //  this.registerMenuEvents();

    if (this.isFirstViewing) {
      this.isFirstViewing = false;
      this.splashScreen.hide();
    }
  }

  protected setViewInRunningMode(value: boolean): void {
    /*     this.signal.enable(value)
          .then(() => {
            return Promise.resolve();
          }, () => {
            return Promise.resolve();
          }).then(() => { */
    // this.leftmenu.enable(!value);
    // this.rightmenu.enable(!value);

    (value) ? this.display.setKeepScreenOn(true) : this.display.setKeepScreenOn(false);
    (value) ? this.statusBar.hide() : this.statusBar.show();
    //    });
  }

  /**
   * When `this.fabcontainer` buttons are clicked, it will first execute code in
   * `fabcontainer.component` (Child component). afterwards it will execute this function.
   */
  protected onAction(emission: FabEmission): void {
    switch (emission.action) {
      case FabAction.Home:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        this.floatingbuttons.setToPausedMode();
        this.router.navigate(['/home']);
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        this.floatingbuttons.setToPausedMode();
        this.menuCtrl.open('end');
        // this.router.navigate(['/interval-settings']);
        break;
      case FabAction.Reset:
        this.aitResetTimer();
        this.setViewInRunningMode(false);
        break;
      case FabAction.Start:
        this.sots.sequencer.start();
        this.setViewInRunningMode(true);
        break;
      case FabAction.Pause:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        break;
    }
    emission.container.close();
  }
}
