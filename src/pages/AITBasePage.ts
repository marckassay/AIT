import { FabAction, FabContainerComponent, FabEmission } from '../app/components/fabcontainer.component/fabcontainer.component';
import { AITSignal } from '../app/core/AITSignal';
import { Insomnia } from '@ionic-native/insomnia';
import { ChangeDetectorRef, OnInit, Optional, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { AITStorage } from '../app/core/AITStorage';
import { UUIDData } from '../app/app.component';
import { SequenceStates, SotsForAit } from '../app/core/SotsForAit';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ServiceLocator } from '../app/app.module';
import { SplashScreen } from '@ionic-native/splash-screen';

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

  protected grandTime: string;
  private isFirstViewing: boolean;
  private currentUUID: string;

  constructor( @Optional() ngDectector: ChangeDetectorRef,
    @Optional() navParams: NavParams,
    @Optional() navCtrl: NavController) {
    this.ngDectector = ngDectector;
    this.navParams = navParams;
    this.navCtrl = navCtrl;

    this.isFirstViewing = true;
  }

  ngOnInit(): void {
    this.sots = new SotsForAit();
    this.screenOrientation = ServiceLocator.injector.get(ScreenOrientation);
    this.storage = ServiceLocator.injector.get(AITStorage);
    this.menuCtrl = ServiceLocator.injector.get(MenuController);
    this.signal = ServiceLocator.injector.get(AITSignal);
    this.insomnia = ServiceLocator.injector.get(Insomnia);
    this.splashScreen = ServiceLocator.injector.get(SplashScreen);

    this.screenOrientation.onChange().subscribe(() => {
      // this is need to refresh the view when being revisited from changed in interval-settings
      this.ngDectector.detectChanges();
    });

    if (this.isFirstViewing) {
      this.loadViewAndTimer();
    }
  }

  ionViewDidLoad() {
    // if coming from right sidemenu (or any sidemenu), no 'ionXxx()' will be
    // called since sidemenus are just menus, not pages.
    this.menuCtrl.get('right').ionClose.debounceTime(125).subscribe(() => {
      this.loadViewAndTimer();
    });
  }

  ionViewWillEnter() {
    if (this.isFirstViewing === false) {
      this.loadViewAndTimer();
    }
  }

  ionViewDidEnter() {

  }

  private loadViewAndTimer = () => {
    this.aitLoadView();
    this.aitLoadTimer();
  }

  private aitLoadView(): void {
    this.aitSetViewRunningMode(false);
  }

  private aitLoadTimer(): void {
    this.aitLoadData();
  }

  private aitLoadData(): void {
    const uuid = (this.navParams.data) ? this.navParams.data : this.currentUUID;

    if (uuid) {
      this.menu.reset();

      this.storage.getItem(uuid).then((value: any) => {
        this.uuidData = (value as UUIDData);
        this.aitBuildTimer();
        this.aitSubscribeTimer();
      }).catch(() => {
        // console.log("interval-display preinitializeDisplay error")
      });
    }
  }

  protected aitBuildTimer(): void {
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime();
  }

  protected aitSubscribeTimer(): void {
    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();

    // finally, end of view cycle...
    if (this.isFirstViewing) {
      this.splashScreen.hide();
      this.isFirstViewing = false;
    }
  }

  private aitResetView() {
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime();

    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();
  }

  private aitResetTimer(): void {
    this.sots.sequencer.reset();
  }

  private aitSetViewRunningMode(value: boolean) {
    this.menuCtrl.enable(!value, 'left');
    this.menuCtrl.enable(!value, 'right');
    (value) ? this.insomnia.keepAwake() : this.insomnia.allowSleepAgain();
  }

  protected onAction(emission: FabEmission) {
    switch (emission.action) {
      case FabAction.Home:
        this.sots.sequencer.pause();
        this.aitSetViewRunningMode(false);
        this.menuCtrl.open('left');
        break;
      case FabAction.Program:
        this.sots.sequencer.pause();
        this.aitSetViewRunningMode(false);
        this.menuCtrl.open('right');
        break;
      case FabAction.Reset:
        this.aitResetView();
        this.aitResetTimer();
        this.aitSetViewRunningMode(false);
        break;
      case FabAction.Start:
        this.sots.sequencer.start();
        this.aitSetViewRunningMode(true);
        break;
      case FabAction.Pause:
        this.sots.sequencer.pause();
        this.aitSetViewRunningMode(false);
        break;
    }
    emission.container.close();
  }
}
