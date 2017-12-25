import { AITStorage } from '../app/core/AITStorage';
import { FabAction, FabContainerComponent, FabEmission } from '../app/components/fabcontainer.component/fabcontainer.component';
import { Insomnia } from '@ionic-native/insomnia';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { MenuController, NavController, NavParams } from 'ionic-angular';
import { AITSignal } from '../app/core/AITSignal';
import { UUIDData } from '../app/app.component';
import { SequenceStates, SotsForAit } from '../app/core/SotsForAit';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


export class AITBasePage {
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

  @ViewChild(FabContainerComponent)
  protected menu: FabContainerComponent;

  protected grandTime: string;
  private currentUUID: string;
  protected sots: SotsForAit;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public signal: AITSignal,
    public ngDectector: ChangeDetectorRef,
    public splashScreen: SplashScreen,
    public insomnia: Insomnia,
    public screenOrientation: ScreenOrientation) {
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
        this.uuidData = (value as UUIDData);
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
    this.viewState = SequenceStates.Loaded;
    this.grandTime = this.sots.getGrandTime();
  }

  protected aitSubscribeTimer(): void {
    // this is need to refresh the view when being revisited from changed in interval-settings
    this.ngDectector.detectChanges();
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
