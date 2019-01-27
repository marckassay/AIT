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
import { ChangeDetectorRef, ComponentFactoryResolver, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { FabAction, FabContainerComponent, FabEmission } from '../components/fab-container/fab-container';
import { SideMenuResponse, SideMenuService } from '../components/side-menu/side-menu.service';
import { ScreenService } from '../services/screen.service';
import { SignalService } from '../services/signal.service';
import { SotsForAit } from '../services/sots/ait-sots';
import { SequenceStates } from '../services/sots/ait-sots.util';
import { UUIDData } from '../services/storage/ait-storage.interfaces';
import { AITStorage } from '../services/storage/ait-storage.service';

export class AITBasePage implements OnInit {

  @ViewChild(FabContainerComponent)
  protected floatingbuttons: FabContainerComponent;

  protected _uuidData: any;
  protected get uuidData(): any {
    return this._uuidData;
  }
  protected set uuidData(value: any) {
    this._uuidData = value;
    this.changeRef.markForCheck();
  }

  protected _settingsPageClass: any;
  protected get settingsPageClass(): any {
    return this._settingsPageClass;
  }
  protected set settingsPageClass(value: any) {
    this._settingsPageClass = value;
  }

  // this type assignment to variable is for Angular template can access enum values.
  protected SS = SequenceStates;
  private _timerState: SequenceStates;
  protected get timerState(): SequenceStates {
    return this._timerState;
  }
  protected set timerState(value: SequenceStates) {
    this._timerState = value;
  }

  protected sots: SotsForAit;

  protected grandTime: string;

  constructor(
    @Optional() protected route: ActivatedRoute,
    @Optional() protected router: Router,
    @Optional() protected componentFactoryResolver: ComponentFactoryResolver,
    @Optional() protected changeRef: ChangeDetectorRef,
    @Optional() protected menuCtrl: MenuController,
    @Optional() protected signal: SignalService,
    @Optional() protected screen: ScreenService,
    @Optional() protected storage: AITStorage,
    @Optional() protected menuSvc: SideMenuService
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
    this.floatingbuttons.setToLoadedMode();

    this.timerState = SequenceStates.Loaded;

    this.setAppToRunningMode(false, false);

    this.attachSettingsAndCheckHome();
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

  /**
   * Sets the page in 1 of two states, depending if the timer is ticking or not.
   *
   * @param value true if timer is ticking
   */
  protected setAppToRunningMode(value: boolean, includeMenus: boolean = true): void {
    // this.signal.enable(value)
    this.screen.setKeepScreenOn(value);
    this.screen.showStatusBar(!value);

    if (includeMenus) {
      ['start', 'end'].forEach((id) => {
        this.menuCtrl.enable(!value, id);
      });
    }
  }

  private resetTimer(): void {
    this.timerState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime({ time: -1 });
    this.sots.sequencer.reset();
  }

  /**
   * Calls `menuService` with setting page class and awaits until subscription notifies to check
   * home page too, so that side menus and floatingbuttons can be enabled accordingly.
   *
   * This method subscribes to only 2 responses and unconditional sends 1 request.
   *
   * First it sends request for settings page to be loaded into `end` sidemenu. Afterwards a response
   * stating "end is loaded", which it will request to App that `start` sidemenu can be loaded now.
   * And if or when `start` menu is loaded, the last response received will verify this and this
   * method is now done subcribing.
   */
  private attachSettingsAndCheckHome(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const menuSubscription = this.menuSvc.subscribe(
        (note) => {
          if ((note as SideMenuResponse).response !== undefined) {
            note = (note as SideMenuResponse);
            if ((note.subject === 'end') && (note.response === 'loaded')) {
              console.log('aitbase', 2, 'requesting status of start');
              this.floatingbuttons.setProgramButtonToVisible();
              this.menuCtrl.enable(true, 'end');
              this.menuSvc.next({ subject: 'start', request: 'status' });
            } else if ((note.subject === 'start') && (note.response === 'loaded')) {
              console.log('aitbase', 6, 'start is loaded');
              this.floatingbuttons.setHomeButtonToVisible();
              this.menuCtrl.enable(true, 'start');
              menuSubscription.unsubscribe();
              resolve();
            }
          }
        }, () => {
          reject();
        }, () => {
          resolve();
        });
      console.log('aitbase', 1, 'requesting component to be loaded');
      const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(this.settingsPageClass);
      this.menuSvc.next({ subject: 'end', request: 'load', component: resolvedComponent });
    });
  }

  /**
   * When `this.fabcontainer` buttons are clicked, it will first execute code in
   * `fabcontainer.component` (Child component). afterwards it will execute this function.
   */
  protected onAction(emission: FabEmission): void {
    switch (emission.action) {
      case FabAction.Home:
        this.sots.sequencer.pause();
        this.setAppToRunningMode(false);
        this.floatingbuttons.setToPausedMode();
        this.menuCtrl.open('start');
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.setAppToRunningMode(false);
        this.floatingbuttons.setToPausedMode();
        this.menuCtrl.open('end');
        break;
      case FabAction.Reset:
        this.resetTimer();
        this.setAppToRunningMode(false);
        break;
      case FabAction.Start:
        this.sots.sequencer.start();
        this.setAppToRunningMode(true);
        break;
      case FabAction.Pause:
        this.sots.sequencer.pause();
        this.setAppToRunningMode(false);
        break;
    }
    emission.container.close();
  }
}
