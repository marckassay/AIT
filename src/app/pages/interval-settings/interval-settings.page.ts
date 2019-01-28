import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IntervalStorageData } from 'src/app/services/storage/ait-storage.interfaces';

import { AITBaseSettingsPage } from '../ait-basesettings.page';

@Component({
  selector: 'app-interval-settings',
  templateUrl: './interval-settings.page.html',
  styleUrls: ['./interval-settings.page.scss'],
})

export class IntervalSettingsPage extends AITBaseSettingsPage {
  subject$(): BehaviorSubject<IntervalStorageData> {
    return this.subject as BehaviorSubject<IntervalStorageData>;
  }

  get totaltime(): string {
    if (this.subject$) {
      // const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return ''; // moment(totaltimeInSeconds * 1000).format('mm:ss.S');
    } else {
      return '00:00.0';
    }
  }

  get countdownLabel(): string {
    if (this.subject$) {
      return ':'; // + this.data.countdown;
    } else {
      return ':0';
    }
  }
}
