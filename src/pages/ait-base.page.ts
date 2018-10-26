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
import { UUIDData } from '../providers/storage/ait-storage.interfaces';
import { FabAction, FabContainerComponent, FabEmission } from '../components/fab-container/fab-container';
import { ChangeDetectorRef, OnInit, Optional, ViewChild, ComponentFactoryResolver, ViewContainerRef, SkipSelf } from '@angular/core';
import { MenuController, NavParams } from 'ionic-angular';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { AITSignal } from '../providers/ait-signal';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SotsForAit } from '../providers/sots/ait-sots';
import { SequenceStates } from '../providers/sots/ait-sots.util';
import { AITBrightness } from '../providers/ait-screen';
import { AITBaseSettingsPage } from './ait-basesettings.page';
import { HomeDisplayService } from '../providers/home-display.service';
import { Menu } from 'ionic-angular/components/app/menu-interface';
import { Subscription, Subject } from 'rxjs';

export class AITBasePage implements OnInit {
  @ViewChild(FabContainerComponent)
  protected floatingbuttons: FabContainerComponent;

  public _uuidData: UUIDData;

  get uuidData(): UUIDData {
    return this._uuidData;
  }
  set uuidData(value: UUIDData) {
    this._uuidData = value;
  }

  // this type assignment to variable is for angular view
  // can access enum values.
  protected states = SequenceStates;
  // TODO: create a accessor and mutator and tie in FabContainerComponent viewState too.
  protected viewState: SequenceStates;
  protected sots: SotsForAit;
  protected grandTime: string;
  protected isFirstViewing: boolean;
  private leftmenu: Menu;
  private rightmenu: Menu;
  private rightmenuOpenSubscription: Subscription;
  // private rightmenuCloseSubscription: Subscription;
  private rightmenuComponentInstance: AITBaseSettingsPage;
  private promise: Promise<any>;
  private subject: Subject<any>;

  constructor(
    @Optional() protected componentFactoryResolver: ComponentFactoryResolver,
    @Optional() protected ngDectector: ChangeDetectorRef,
    @Optional() protected navParams: NavParams,
    @Optional() protected homeService: HomeDisplayService,
    @Optional() protected screenOrientation: ScreenOrientation,
    @Optional() protected storage: AITStorage,
    @Optional() @SkipSelf() public menuCtrl: MenuController,
    @Optional() protected signal: AITSignal,
    @Optional() protected display: AITBrightness,
    @Optional() protected splashScreen: SplashScreen,
    @Optional() protected statusBar: StatusBar
  ) {
    this.leftmenu = this.menuCtrl.get('left');
    this.rightmenu = this.menuCtrl.get('right');
  }

  ngOnInit(): void {
    this.isFirstViewing = true;
    this.sots = new SotsForAit();

    this.screenOrientation.onChange().subscribe(() => {
      this.ngDectector.detectChanges();
    });
  }

  /**
   * Called by any of the subclasses settings page when `ionViewDidLoad` method is called by Ionic.
   *
   * @param settingsPage
   */
  protected createSettingsPage(settingsPage?: any): void {
    const rightMenuInnerHTML: ViewContainerRef = this.navParams.data.rightmenu;
    rightMenuInnerHTML.clear();

    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory<AITBaseSettingsPage>(settingsPage);

    this.rightmenuComponentInstance = rightMenuInnerHTML.createComponent<AITBaseSettingsPage>(resolvedComponent).instance;
    this.rightmenuComponentInstance.uuid = this.navParams.data.uuid;

    this.floatingbuttons.setProgramButtonToVisible();
  }

  private createHomePage(): void {
    this.homeService.notifiyAppOfCompletion();

    this.floatingbuttons.setHomeButtonToVisible();
  }

  registerMenuEvents(): void {
    if (this.rightmenuOpenSubscription) {
      this.rightmenuOpenSubscription.unsubscribe();
    }

    this.rightmenuOpenSubscription = this.rightmenu.ionOpen.subscribe(() => {
      this.rightmenuComponentInstance.loadAppData();
    });
  }

  /**
   * This event only happens once per page being created. If a page leaves but is cached, then this
   * event will not fire again on a subsequent viewing.
   */
  ionViewDidLoad(): void {
    this.createSettingsPage();
    this.createHomePage();
    this.floatingbuttons.setToLoadedMode();
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
    this.setViewInRunningMode(false);
  }

  /**
   * This is critical to fully unsubscribe the 2 Subscriptions of this class. When transitioning from
   * one ait page to another, the simlpified call stack below represents this algorhthm:
    ```
    ...
    createSettingsPage() TimerDisplay
    ...
    ionViewWillLeave() IntervalDisplay
    ...
    registerMenuEvents() TimerDisplay
    ...
    ```
   * In this example, the user goes from `IntervalDisplay` to `TimerDisplay`. Upon first viewing of
   * `TimerDisplay`, the 2 Subscriptions will be undefined for its instance, but the internal list of
   * RxJS will have Subscriptions.
   */
  ionViewWillLeave(): void {
    this.rightmenuOpenSubscription.unsubscribe();
  }

  private aitLoadData(): void {
    const uuid = this.navParams.data.uuid;

    if (uuid) {
      const promiseAndSubject = this.storage.getPagePromiseAndSubject(uuid);
      this.promise = promiseAndSubject[0];
      this.subject = promiseAndSubject[1];

      this.promise.then((value: any) => {

        this.uuidData = (value as UUIDData);
        if (value.hasOwnProperty('hasLastSettingChangedTime')) {
          if (value.hasLastSettingChangedTime || this.isFirstViewing) {
            this.aitBuildTimer();

            value.hasLastSettingChangedTime = false;
            this.subject.next(this.uuidData);
          }
        } else {
          this.aitBuildTimer();
        }

      }).catch(() => {
        // console.log("interval-display preinitializeDisplay error")
      });
    }
  }

  protected aitBuildTimer(): void {
    this.aitSubscribeTimer();
    this.aitResetTimer();
    this.aitPostTimerBuilt();
  }

  /**
   * To be implemented by subclasses.
   */
  protected aitSubscribeTimer(): void { }

  private aitResetTimer(): void {
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime({ time: -1 });
    this.sots.sequencer.reset();
    this.ngDectector.detectChanges();
  }

  protected aitPostTimerBuilt(): void {
    this.registerMenuEvents();

    if (this.isFirstViewing) {
      this.isFirstViewing = false;
      this.splashScreen.hide();
    }
  }

  protected setViewInRunningMode(value: boolean): void {
    this.leftmenu.enable(!value);
    this.rightmenu.enable(!value);

    (value) ? this.display.setKeepScreenOn(true) : this.display.setKeepScreenOn(false);
    (value) ? this.statusBar.hide() : this.statusBar.show();
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
        this.leftmenu.open();
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        this.rightmenu.open();
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
