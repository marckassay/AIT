import { AITStorage } from '../app/core/AITStorage';
import { FabAction, FabContainerComponent, FabEmission } from '../app/components/fabcontainer.component/fabcontainer.component';
import { Insomnia } from '@ionic-native/insomnia';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { AITSignal } from '../app/core/AITSignal';
import { UUIDData } from '../app/app.component';
import { SotsForAit } from './SotsForAit';


export class AITBasePage {
  _data: UUIDData;
  get data(): UUIDData {
    return this._data;
  }
  set data(value: UUIDData) {
    this._data = value;
  }

  @ViewChild(FabContainerComponent)
  protected menu: FabContainerComponent;

  protected currentUUID: string;
  protected sots: SotsForAit;
  protected viewState: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public signal: AITSignal,
    public ngDectector: ChangeDetectorRef,
    public splashScreen: SplashScreen,
    public insomnia: Insomnia) {
  }

  ionViewDidLoad() {
    const loadViewAndTimer = () => {
      this.aitLoadView();
      this.aitLoadTimer();
    };
    // if coming from right sidemenu (or any sidemenu), no 'ionXxx()' will be
    // called since sidemenus are just menus, not pages.
    this.menuCtrl.get('right').ionClose.debounceTime(250).subscribe(() => {
      loadViewAndTimer();
    });

    loadViewAndTimer();
  }

  ionViewDidEnter() {
    this.aitLoadView();
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
        this.data = (value as UUIDData);
        this.sots = new SotsForAit();
        this.aitBuildTimer();
        this.aitSubscribeTimer();

        // TOOD: can't seem to hide startup flash of white other then
        // to do the following:
        setTimeout(() => {
          this.splashScreen.hide();
        }, 500);

      }).catch(() => {
        // console.log("interval-display preinitializeDisplay error")
      });
    }
  }

  protected aitBuildTimer(): void {
    throw new Error('Method hasnt been overriden.  This method needs to call: sots.build( ... )');
  }

  protected aitSubscribeTimer(): void {
    throw new Error('Method hasnt been overriden.  This method needs to call: sots.subscribe({ ... })');
  }

  protected aitResetView(): void {
    throw new Error('Method not implemented.');
  }

  private aitResetTimer(): void {
    this.sots.sequencer.reset();
  }

  private aitSetViewRunningMode(value: boolean) {
    this.menuCtrl.enable(!value, 'left');
    this.menuCtrl.enable(!value, 'right');
    (value) ? this.insomnia.keepAwake() : this.insomnia.allowSleepAgain();
  }

  onAction(emission: FabEmission) {
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
