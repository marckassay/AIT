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
import { ComponentFactoryResolver, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';

import { FabAction, FabContainerComponent, FabEmission } from '../components/fab-container/fab-container';
import { MenuItemService } from '../components/menu-item.service';
import { AITBrightness } from '../providers/ait-screen';
import { AITSignal } from '../providers/ait-signal';
import { SotsForAit } from '../providers/sots/ait-sots';
import { SequenceStates } from '../providers/sots/ait-sots.util';
import { UUIDData } from '../providers/storage/ait-storage.interfaces';
import { AITStorage } from '../providers/storage/ait-storage.service';

export class AITBasePage implements OnInit {

  @ViewChild(FabContainerComponent)
  protected floatingbuttons: FabContainerComponent;

  protected _uuidData: UUIDData;
  get uuidData(): UUIDData {
    return this._uuidData;
  }
  set uuidData(value: UUIDData) {
    this._uuidData = value;
  }

  /*   protected _settingsPageClass: typeof AITBaseSettingsPage; */
  protected _settingsPageClass: any;
  get settingsPageClass(): any {
    return this._settingsPageClass;
  }
  set settingsPageClass(value: any) {
    this._settingsPageClass = value;
  }

  // this type assignment to variable is for Angular template can access enum values.
  SequenceStates = SequenceStates;
  protected viewState: SequenceStates;

  protected sots: SotsForAit;
  protected grandTime: string;

  constructor(
    @Optional() protected route: ActivatedRoute,
    @Optional() protected router: Router,
    @Optional() @SkipSelf() public menuCtrl: MenuController,
    @Optional() protected screenOrientation: ScreenOrientation,
    @Optional() protected splashScreen: SplashScreen,
    @Optional() protected statusBar: StatusBar,
    @Optional() protected signal: AITSignal,
    @Optional() protected display: AITBrightness,
    @Optional() protected componentFactoryResolver: ComponentFactoryResolver,
    @Optional() protected storage: AITStorage,
    @Optional() protected menuService: MenuItemService
  ) { }

  ngOnInit() {
    this.sots = new SotsForAit();
    this.route.data.subscribe((data: { uuiddata: UUIDData }) => {
      this.uuidData = data.uuiddata;
    });
  }

  /**
   * Fired when the component being routed to is about to animate in.
   */
  ionViewWillEnter(): void {
    throw new Error('Subclasses of AITBasePage need to implement ionViewWillEnter().');
  }

  /**
   * Fired when the component being routed to has animated in.
   */
  ionViewDidEnter(): void {
    this.setViewInRunningMode(false);

    // TODO: defer until start button is pressed
    this.aitSubscribeTimer();

    this.floatingbuttons.setToLoadedMode();

    this.attachSettingsPage();
  }

  // tslint:disable-next-line:member-ordering
  private attachSettingsPage(): void {

    this.menuService.subscribe((observer) => {
      if (observer.componentType.name === this.settingsPageClass.name) {
        this.floatingbuttons.setProgramButtonToVisible();
      }
    });

    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(this.settingsPageClass);
    this.menuService.next(resolvedComponent);
  }

  /**
   * Fired when the component being routed from is about to animate.
   */
  ionViewWillLeave(): void {
    throw new Error('Subclasses of AITBasePage need to implement ionViewWillLeave().');
  }

  /**
  * Fired when the component being routed from has animated.
  */
  ionViewDidLeave(): void {
    this.aitUnsubscribeTimer();

  }

  protected aitSubscribeTimer(): void {
    throw new Error('Subclasses of AITBasePage need to implement aitSubscribeTimer().');
  }

  protected aitUnsubscribeTimer(): void {
    throw new Error('Subclasses of AITBasePage need to implement aitUnsubscribeTimer().');
  }

  protected aitBuildTimer(): void {
    this.aitResetTimer();
  }

  private aitResetTimer(): void {
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime({ time: -1 });
    this.sots.sequencer.reset();
  }

  protected setViewInRunningMode(value: boolean): void {
    /*     this.signal.enable(value)
          .then(() => {
            return Promise.resolve();
          }, () => {
            return Promise.resolve();
          }).then(() => { */

    this.menuCtrl.enable(!value, 'start');
    this.menuCtrl.enable(!value, 'end');

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
        this.floatingbuttons.setToPausedMode();
        this.menuCtrl.open('start');
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.setViewInRunningMode(false);
        this.floatingbuttons.setToPausedMode();
        this.menuCtrl.open('end');
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
