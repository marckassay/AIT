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
import { FabAction, FabContainerComponent, FabEmission } from '../components/fab-container/fab-container';
import { ChangeDetectorRef, OnInit, Optional, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { AITStorage } from '../app/core/AITStorage';
import { AITSignal } from '../app/core/AITSignal';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SotsForAit } from '../app/core/SotsForAit';
import { SequenceStates } from '../app/core/SotsUtil';
import { AITBrightness } from '../app/core/AITBrightness';

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
  protected grandTime: string;
  private isFirstViewing: boolean;

  constructor(@Optional() protected ngDectector: ChangeDetectorRef,
    @Optional() protected navParams: NavParams,
    @Optional() protected navCtrl: NavController,
    @Optional() protected screenOrientation: ScreenOrientation,
    @Optional() protected storage: AITStorage,
    @Optional() protected menuCtrl: MenuController,
    @Optional() protected signal: AITSignal,
    @Optional() protected display: AITBrightness,
    @Optional() protected splashScreen: SplashScreen,
    @Optional() protected statusBar: StatusBar
  ) {
    this.sots = new SotsForAit();
    this.isFirstViewing = true;
  }

  ngOnInit(): void {
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

    (value) ? this.display.setKeepScreenOn(true) : this.display.setKeepScreenOn(false);

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
