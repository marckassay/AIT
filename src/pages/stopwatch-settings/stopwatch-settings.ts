import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { IonicPage, MenuController, ToastController } from 'ionic-angular';
import { AITStorage } from '../../app/core/AITStorage';
import { StopwatchStorageData } from '../../app/app.component';
import { AITBaseSettingsPage } from '../AITBaseSettingsPage';

@IonicPage()
@Component({
  selector: 'page-stopwatch-settings',
  templateUrl: 'stopwatch-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class StopwatchSettingsPage extends AITBaseSettingsPage {
  @Input('data')
  get data(): StopwatchStorageData {
    return this._uuidData as StopwatchStorageData;
  }
  set data(value: StopwatchStorageData) {
    this._uuidData = value;
  }

  constructor(public storage: AITStorage,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public ngDectector: ChangeDetectorRef) {
    super(storage,
      menuCtrl,
      toastCtrl,
      ngDectector);
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':10';
    }
  }

  protected dataChanged(property?: string): void {
    property!;
    this.storage.setItem(this.data);
    this.ngDectector.detectChanges();
  }
}
