import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FabAction, FabContainerComponent, FabEmission } from '../../app/components/fabcontainer.component/fabcontainer.component';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AITStorage } from '../../app/core/AITStorage';
import { AITSignal } from '../../app/core/AITSignal';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';

@IonicPage()
@Component({
  selector: 'page-timer-display',
  templateUrl: 'timer-display.html',
})
export class TimerDisplayPage {
  @ViewChild(FabContainerComponent)
  private menu: FabContainerComponent;

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

  }

  ionViewDidEnter() {
  }

  aitLoadView(): void {
    throw new Error('Method not implemented.');
  }
  aitLoadTimer(): void {
    throw new Error('Method not implemented.');
  }
  aitLoadData(): void {
    throw new Error('Method not implemented.');
  }
  aitBuildTimer(): void {
    throw new Error('Method not implemented.');
  }
  aitSubscribeTimer(): void {
    throw new Error('Method not implemented.');
  }
  aitResetView(): void {
    throw new Error('Method not implemented.');
  }
  aitResetTimer(): void {
    throw new Error('Method not implemented.');
  }
  aitSetViewRunningMode(value: boolean): void {
    value!;
    throw new Error('Method not implemented.');
  }

  onAction(emission: FabEmission) {
    switch (emission.action) {
      case FabAction.Home:
        this.menu!;
        break;
      case FabAction.Program:

        break;
      case FabAction.Reset:

        break;
      case FabAction.Start:

        break;
      case FabAction.Pause:

        break;
    }
    emission.container.close();
  }
}
