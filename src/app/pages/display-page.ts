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
// tslint:disable-next-line:max-line-length
import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { XProgressBarComponent } from 'src/app/components/x-progress-bar/x-progress-bar.component';

import { AppUtils } from '../app.utils';
import { FabAction, FabContainerComponent, FabEmission } from '../components/fab-container/fab-container';
import { SideMenuService, SideMenuStatusResponse } from '../components/side-menu/side-menu.service';
import { ScreenService } from '../services/screen.service';
import { SignalService } from '../services/signal.service';
import { SotsForAit } from '../services/sots/ait-sots';
import { SequenceStates } from '../services/sots/ait-sots.util';
import { StorageDefaultData } from '../services/storage/ait-storage.defaultdata';
import { UUIDData } from '../services/storage/ait-storage.shapes';


export class DisplayPage implements OnInit, AfterViewInit {
  @ViewChild(FabContainerComponent)
  protected floatingbuttons: FabContainerComponent;

  @ViewChild(XProgressBarComponent)
  protected progress: XProgressBarComponent;

  private componentSubjet: BehaviorSubject<UUIDData>;
  private componentSubptn: Subscription;
  private isStartUp: boolean;

  protected _uuidData: any;
  public get uuidData(): any {
    return this._uuidData;
  }
  public set uuidData(value: any) {
    this._uuidData = value;
  }

  protected _settingsPageClass: any;
  protected get settingsPageClass(): any {
    return this._settingsPageClass;
  }
  protected set settingsPageClass(value: any) {
    this._settingsPageClass = value;
  }

  protected _timerState: SequenceStates;
  protected get timerState(): SequenceStates {
    return this._timerState;
  }
  protected set timerState(value: SequenceStates) {
    this._timerState = value;
  }

  // this type assignment to variable is for Angular template can access enum values.
  SS = SequenceStates;
  protected sots: SotsForAit;
  protected grandTime: string;

  /**
   * When entering into display-pages, initially or not, this flag is used to determine if the timer
   * needs to be rebuilt. For instance, if the user changes a setting that is irrelevant to `sots`,
   * then rebuilding of `sots` is not required.
   */
  protected noRebuild: boolean;

  constructor(
    @Optional() protected route: ActivatedRoute,
    @Optional() protected componentFactoryResolver: ComponentFactoryResolver,
    @Optional() protected injector: Injector,
    @Optional() protected changeRef: ChangeDetectorRef,
    @Optional() protected signalSvc: SignalService,
    @Optional() protected screenSvc: ScreenService,
    @Optional() protected menuSvc: SideMenuService
  ) { }

  ngOnInit(): void {
    this.sots = new SotsForAit();
    this.signalSvc.onInit();
    this.screenSvc.onInit();

    this.isStartUp = !!(this.route.snapshot.queryParams.isStartUp);
    this.componentSubjet = (this.route.snapshot.data as any).subject as BehaviorSubject<any>;

    this.componentSubptn = this.componentSubjet.subscribe((uuidData: UUIDData) => {
      // TODO: pipe a 'distinctUntil' operator for coming back from settings - but this is the same reference
      if (this.uuidData) {
        this.uuidData = uuidData;

        this.aitBuildTimer();
        this.aitSubscribeTimer();
        this.aitPostBuildTimer();
      } else {
        this.uuidData = uuidData;
      }
    });
  }

  ngAfterViewInit(): void {
    this.progress.show();
  }

  ngOnDestroy(): void {
  }

  /**
   * Fired when the component being routed to is about to animate in.
   */
  ionViewWillEnter(): void {
    throw new Error('Subclasses of DisplayPage need to implement ionViewWillEnter().');
  }

  /**
   * Fired when the component being routed to has animated in. This is called only during startup
   * and when the user exits from the 'start' menu and returns. The 'end' menu has no consequence.
   */
  ionViewDidEnter(): void {
    this.progress.show();
    this.aitPostBuildTimer();
    this.attachSettingsAndCheckHome();
  }

  /**
   * Runs when the page has finished leaving and is no longer the active page.
   */
  ionViewDidLeave(): void {
    this.isStartUp = false;
  }

  /**
   * Fired when the component being routed from is about to animate.
   */
  // ionViewWillLeave(): void { }

  protected aitBuildTimer(): void {
    throw new Error('Subclasses of DisplayPage need to implement aitBuildTimer().');
  }

  protected aitSubscribeTimer(): void {
    throw new Error('Subclasses of DisplayPage need to implement aitSubscribeTimer().');
  }

  /**
   * When returning from display-page setting's, this is called if the data object changed in the
   * subject.subscribe().
   */
  private aitPostBuildTimer(): void {
    if (this.noRebuild === false) {
      this.timerState = SequenceStates.Loaded;
      this.floatingbuttons.setToLoadedMode();
    }

    if (this.isStartUp === false) {
      this.setAppToRunningMode(false);
    }
  }

  /**
   * Sets the page in 1 of two states, depending if the timer is ticking or not.
   *
   * @param value true if timer is ticking
   */
  protected async setAppToRunningMode(value: boolean): Promise<void> {
    await this.menuSvc.enableLeftMenu(value === false);
    await this.menuSvc.enableRightMenu(value === false);

    if (this.timerState === SequenceStates.Completed) {
      this.floatingbuttons.setToCompletedMode();
      this.grandTime = AppUtils.totaltime(this.uuidData);

      // wait until completed sequence is done until proceeding to set screen to running mode...
      await this.signalSvc.completed();
    }

    this.screenSvc.setScreenToRunningMode(value);

    await this.signalSvc.enablePreferredVolume(value)
      .catch((reason) => {
        if (reason === 'DO_NOT_DISTURB') {
          // at this point toast notification (from signalSvc) should appear to inform user
          this.floatingbuttons.setToLoadedMode();
          this.resetTimer();
          this.setAppToRunningMode(false);
        }
      });
  }

  private resetTimer(): void {
    this.grandTime = this.sots.getGrandTime({ time: -1 });
    this.timerState = SequenceStates.Loaded;
    this.sots.sequencer.reset();
    this.signalSvc.clearHasBeenInformed();
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
  private async attachSettingsAndCheckHome(): Promise<void> {
    const resolveSideMenus = (resolve: () => void): void => {
      this.floatingbuttons.setHomeButtonToVisible();
      this.menuSvc.enableLeftMenu(true);
      this.progress.hide();
      resolve();
    };

    await new Promise<void>((resolve, reject): void => {
      // subscribe to menu service
      this.menuSvc.listen({
        next: (note): void => {
          if ('response' in note) {
            note = note as SideMenuStatusResponse;

            // when response from the 'this.menuSvc.next()' call below
            if ((note.subject === 'end') && (note.response === false)) {

              const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(this.settingsPageClass);
              this.menuSvc.send({
                subject: 'end',
                request: 'load',
                uuid: (this.uuidData as UUIDData).uuid,
                component: resolvedComponent,
                injector: this.injector
              });
            } else if ((note.subject === 'end') && (note.response === true)) {

              this.floatingbuttons.setProgramButtonToVisible();
              this.menuSvc.enableRightMenu(true);

              if (this.isStartUp === true) {
                this.menuSvc.send({
                  subject: 'start',
                  request: 'status',
                  uuid: StorageDefaultData.HOME_ID
                });
              } else {
                resolveSideMenus(resolve);
              }
              // when response from menuSvc about start menu
            } else if ((note.subject === 'start') && (note.response === true)) {
              resolveSideMenus(resolve);
            }
          }
        },
        error: (): void => {
          reject();
        },
        complete: (): void => {
          reject();
        }
      });

      if (this.isStartUp === false) {
        this.menuSvc.send({
          subject: 'end',
          request: 'status',
          uuid: (this.uuidData as UUIDData).uuid
        });
      }
    });
  }

  /**
   * When `this.fabcontainer` buttons are clicked, it will first execute code in
   * `fabcontainer.component` (Child component). afterwards it will execute this function.
   */
  async action(emission: FabEmission): Promise<void> {
    switch (emission.action) {
      case FabAction.Home:
        this.sots.sequencer.pause();
        this.floatingbuttons.setToPausedMode();
        await this.setAppToRunningMode(false);
        await this.menuSvc.openLeftMenu();
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.floatingbuttons.setToPausedMode();
        await this.setAppToRunningMode(false);
        await this.menuSvc.openRightMenu();
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
  }
}
