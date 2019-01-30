import { Component, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { AppUtils } from 'src/app/app.utils';
import { IntervalStorageData, Limits } from 'src/app/services/storage/ait-storage.interfaces';

import { SettingsPage } from '../settings-page';

@Component({
  selector: 'app-interval-settings',
  templateUrl: './interval-settings.page.html',
  styleUrls: ['./interval-settings.page.scss']
})
export class IntervalSettingsPage extends SettingsPage {

  get data(): IntervalStorageData {
    return this._uuidData as IntervalStorageData;
  }

  private setComputedFactorValue() {
    if (this.data) {
      const lower = this.data.factor === 1 ? 1 : 0;
      const upper = this.data.factor === 1 ? 10 : 100;
      this.computedFactorValue = { lower: lower, upper: upper };
    } else {
      this.computedFactorValue = { lower: 10, upper: 100 };
    }
  }

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
      const value = event.detail.value as Limits;

      if (this.data.factor === 10) {
        if (this.clonedForTenFactor === undefined) {
          this.clonedForOneFactor = undefined;
          this.clonedForTenFactor = AppUtils.clone<Limits>(this.data.activerest);
        }

        if ((this.computedFactorValue.upper !== value.upper) ||
          (this.clonedForTenFactor as Limits).upper === -1) {
          (this.clonedForTenFactor as Limits).upper = -1;
          this.data.activerest.upper = value.upper;
        }

        if ((this.computedFactorValue.lower !== value.lower) ||
          (this.clonedForTenFactor as Limits).lower === -1) {
          (this.clonedForTenFactor as Limits).lower = -1;
          this.data.activerest.lower = value.lower;
        }
      } else {
        if (this.clonedForOneFactor === undefined) {
          this.clonedForTenFactor = undefined;
          this.clonedForOneFactor = AppUtils.clone<Limits>(this.data.activerest);
        }

        let proposed = this.clonedForOneFactor.upper + value.upper;
        if ((this.computedFactorValue.upper !== value.upper) && (this.data.activerest.upper !== proposed)) {
          this.data.activerest.upper = proposed;
        }

        proposed = this.clonedForOneFactor.lower + value.lower;
        if ((this.computedFactorValue.lower !== value.lower) && (this.data.activerest.lower !== proposed)) {
          this.data.activerest.lower = proposed;
        }
      }
    } else if (property === 'intervals') {
      if (this.data.factor === 10) {
        this.clonedForIntervalsFactor = undefined;

        this.data.intervals = event.detail.value as number;
      } else {
        if (this.clonedForIntervalsFactor === undefined) {
          this.clonedForIntervalsFactor = this.data.intervals;
        }

        this.data.intervals = this.clonedForIntervalsFactor + event.detail.value as number;
      }
    } else if (property === 'countdown') {
      if (this.data.factor === 10) {
        this.clonedForCountdownFactor = undefined;

        this.data.countdown = event.detail.value as number;
      } else {
        if (this.clonedForCountdownFactor === undefined) {
          this.clonedForCountdownFactor = this.data.countdown;
        }

        this.data.countdown = this.clonedForCountdownFactor + event.detail.value as number;
      }
    } else if (property === 'factor') {
      this.data.factor = event.detail.value === '10' ? 10 : 1;
      this.setComputedFactorValue();
    }

    super.dataChanged(property, event);
  }
}
