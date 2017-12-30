import { ChangeDetectorRef, OnInit, Optional } from '@angular/core';
import { MenuController, ToastController } from 'ionic-angular';
import { AITStorage } from '../app/core/AITStorage';
import { AppStorageData, UUIDData } from '../app/app.component';
import { ServiceLocator } from '../app/app.module';

export class AITBaseSettingsPage implements OnInit {
  // set by app.component when component is instantiated
  public uuid: string;

  _uuidData: UUIDData;
  get uuidData(): UUIDData {
    return this._uuidData;
  }
  set uuidData(value: UUIDData) {
    this._uuidData = value;
  }

  protected storage: AITStorage;
  protected menuCtrl: MenuController;
  protected toastCtrl: ToastController;
  protected ngDectector: ChangeDetectorRef;
  protected appSoundsDisabled: boolean;
  protected appVibratorDisabled: boolean;
  protected isFirstViewing: boolean;

  constructor( @Optional() ngDectector: ChangeDetectorRef) {
    this.ngDectector = ngDectector;

    this.isFirstViewing = true;
  }

  ngOnInit() {
    this.storage = ServiceLocator.injector.get(AITStorage);
    this.menuCtrl = ServiceLocator.injector.get(MenuController);
    this.toastCtrl = ServiceLocator.injector.get(ToastController);
    // load data now, to prevent white flash when initially opened...
    this.loadViewData();
  }

  ionViewWillEnter() {
    if (this.isFirstViewing === false) {
      this.loadViewData();
    }
    // need this to refresh the view.
    this.ngDectector.detectChanges();
  }

  private loadViewData(): void {
    this.storage.getItem(this.uuid).then((value: UUIDData) => {
      this.uuidData = value;
      this.loadAppData();
    });
  }

  private loadAppData(): void {
    this.menuCtrl.get('right').ionOpen.subscribe(() => {
      this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {
        this.appSoundsDisabled = !(value as AppStorageData).sound;
        this.appVibratorDisabled = !(value as AppStorageData).vibrate;
      });
    });
  }

  protected dataChanged(property?: string): void {
    property!;
    this.ngDectector.detectChanges();

    this.storage.setItem(this.uuidData);
  }

  protected inform(): void {
    let bmesg = (this.appSoundsDisabled) ? 1 : 0;
    bmesg += (this.appVibratorDisabled) ? 2 : 0;
    bmesg += (bmesg === 3) ? 4 : 0;

    let smesg: string;
    if (bmesg === 1) {
      smesg = 'sound is muted';
    } else if (bmesg === 2) {
      smesg = 'vibrate is turned-off';
    } else {
      smesg = 'sound is muted and vibrate is turned-off';
    }

    let toast = this.toastCtrl.create({
      message: 'AiT\'s ' + smesg + '. Go to \'AiT Settings\' page and adjust accordingly if needed.',
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top'
    });

    toast.present();
  }
}
