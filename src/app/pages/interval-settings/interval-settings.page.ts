import { Component } from '@angular/core';
import moment from 'moment';
import { IntervalStorageData, Limits } from 'src/app/services/storage/ait-storage.interfaces';

import { SettingsPage } from '../settings-page';

@Component({
  selector: 'app-interval-settings',
  templateUrl: './interval-settings.page.html',
  styleUrls: ['./interval-settings.page.scss'],
})

export class IntervalSettingsPage extends SettingsPage {
  get data(): IntervalStorageData {
    return this._uuidData as IntervalStorageData;
  }

  get computedFactorValue(): Limits {
    const lower = this.data.factor === 1 ? 0 : 10;
    const upper = this.data.factor === 1 ? 10 : 100;

    return { lower: lower, upper: upper };
  }
  /*   get activerest(): any {
      return this.data.activerest;
    }
    set activerest(value: any) {
      this.data.activerest = {
        lower: value.lower + this.rangeFactor,
        upper: value.upper + this.rangeFactor
      };
    } */

  get totaltime(): string {
    if (this.data) {
      const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return moment(totaltimeInSeconds * 1000).format('mm:ss.S');
    } else {
      return '00:00.0';
    }
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':0';
    }
  }

  dataChanged(property: string, event: CustomEvent): void {
    console.log(property, event.detail.value);
    if (property === 'activerest') {
      if (this.data.factor === 10) {
        this.data.activerest.upper = (event.detail.value as Limits).upper;
        this.data.activerest.lower = (event.detail.value as Limits).lower;
      } else {
        this.data.activerest.upper += (event.detail.value as Limits).upper;
        this.data.activerest.lower += (event.detail.value as Limits).lower;
      }
    } else if (property === 'factor') {
      this.data.factor = event.detail.value === '10' ? 10 : 1;
    }

    super.dataChanged(property, event);
  }
}
