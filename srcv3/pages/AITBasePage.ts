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
import { UUIDData } from '../app/app.component';
import { FabAction, FabContainerComponent, FabEmission } from '../app/components/fabcontainer.component/fabcontainer.component';
import { Insomnia } from '@ionic-native/insomnia';
import { ChangeDetectorRef, OnInit, Optional, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { AITStorage } from '../app/core/AITStorage';
import { AITSignal } from '../app/core/AITSignal';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ServiceLocator } from '../app/app.module';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SotsForAit } from '../app/core/SotsForAit';
import { SequenceStates } from '../app/core/SotsUtil';

export class AITBasePage implements OnInit {
  @ViewChild(FabContainerComponent)
  protected menu: FabContainerComponent;

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
  protected viewState: SequenceStates;
  protected sots: SotsForAit;

  protected navCtrl: NavController;
  protected navParams: NavParams;
  protected menuCtrl: MenuController;
  protected storage: AITStorage;
  protected signal: AITSignal;
  protected ngDectector: ChangeDetectorRef;
  protected insomnia: Insomnia;
  protected screenOrientation: ScreenOrientation;
  protected splashScreen: SplashScreen;
  protected statusBar: StatusBar;

  protected grandTime: string;
  private isFirstViewing: boolean;

  constructor(@Optional() ngDectector: ChangeDetectorRef,
    @Optional() navParams: NavParams,
    @Optional() navCtrl: NavController) {

    this.sots = new SotsForAit();
    this.ngDectector = ngDectector;
    this.navParams = navParams;
    this.navCtrl = navCtrl;

    this.isFirstViewing = true;
  }

  ngOnInit(): void {
    this.screenOrientation = ServiceLocator.injector.get(ScreenOrientation);
    this.storage = ServiceLocator.injector.get(AITStorage);
    this.menuCtrl = ServiceLocator.injector.get(MenuController);
    this.signal = ServiceLocator.injector.get(AITSignal);
    this.insomnia = ServiceLocator.injector.get(Insomnia);
    this.splashScreen = ServiceLocator.injector.get(SplashScreen);
    this.statusBar = ServiceLocator.injector.get(StatusBar);

    // detaching here when timer has completed or paused, and the user re-enters the view, changed
    // wouldn't change. So all subclass views need to manually check for changes. this is done by
    // using 'this.ngDectector.detectChanges()' in the subscribe callbacks (next, complete, error)
    this.ngDectector.detach();

    this.screenOrientation.onChange().subscribe(() => {
      this.ngDectector.detectChanges();
    });

    if (this.isFirstViewing) {
      this.setViewAndLoadData();
    }
  }

  ionViewDidLoad() {
    /*
    this.menuCtrl.get('left').ionOpen.subscribe(() => {
    });
    this.menuCtrl.get('right').ionOpen.subscribe(() => {
    });
    */
    // if coming from right sidemenu (or any sidemenu), no 'ionXxx()' will be
    // called since sidemenus are just menus, not pages.
    this.menuCtrl.get('right').ionClose.debounceTime(125).subscribe(() => {
      this.setViewAndLoadData();
    });
  }

  ionViewWillEnter() {
    if (this.isFirstViewing === false) {
      this.setViewAndLoadData();
    }
  }

  ionViewDidEnter() {
  }

  private setViewAndLoadData = () => {
    this.aitSetViewInRunningMode(false);
    this.aitLoadData();
  }

  private aitLoadData(): void {
    const uuid = this.navParams.data;

    if (uuid) {
      this.menu.reset();

      this.storage.getItem(uuid).then((value: any) => {

        this.uuidData = (value as UUIDData);
        if (value.hasOwnProperty('hasLastSettingChangedTime')) {
          if (value.hasLastSettingChangedTime || this.isFirstViewing) {
            this.aitBuildTimer();

            value.hasLastSettingChangedTime = false;
            this.storage.setItem(this.uuidData);
          }

          this.ngDectector.detectChanges();
        } else {
          this.aitBuildTimer();
        }
      }).catch(() => {
        // console.log("interval-display preinitializeDisplay error")
      });
    }
  }

  protected aitBuildTimer(): void {
    this.aitResetView();
    this.aitSubscribeTimer();
  }

  protected aitSubscribeTimer(): void {
    // finally, end of view cycle...
    if (this.isFirstViewing) {
      setTimeout(() => {
        this.splashScreen.hide();
        this.isFirstViewing = false;
      }, 200);
    }

    this.ngDectector.detectChanges();
  }

  private aitResetView() {
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime({ time: -1 });
  }

  private aitResetTimer(): void {
    this.sots.sequencer.reset();
  }

  protected aitSetViewInRunningMode(value: boolean) {
    this.menuCtrl.enable(!value, 'left');
    this.menuCtrl.enable(!value, 'right');

    (value) ? this.insomnia.keepAwake() : this.insomnia.allowSleepAgain();

    setTimeout(() => {
      (value) ? this.statusBar.hide() : this.statusBar.show();
    }, 500);

    this.ngDectector.detectChanges();
  }

  // when this.fabcontainer buttons are clicked, it will first execute code in
  // fabcontainer.component (Child component). afterwards it will execute this function.
  protected onAction(emission: FabEmission) {
    switch (emission.action) {
      case FabAction.Home:
        this.sots.sequencer.pause();
        this.aitSetViewInRunningMode(false);
        this.menuCtrl.open('left');
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.aitSetViewInRunningMode(false);
        this.menuCtrl.open('right');
        break;
      case FabAction.Reset:
        this.aitResetView();
        this.aitResetTimer();
        this.aitSetViewInRunningMode(false);
        break;
      case FabAction.Start:
        this.sots.sequencer.start();
        this.aitSetViewInRunningMode(true);
        break;
      case FabAction.Pause:
        this.sots.sequencer.pause();
        this.aitSetViewInRunningMode(false);
        break;
    }
    emission.container.close();
  }
}