import { Component, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

export enum HomeAction {
  IntervalTimer,
  Countdown,
  Stopwatch,
  Settings
}

export interface HomeEmission
{
  action: HomeAction;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  @Output()
  onAction = new EventEmitter<HomeEmission>();

  constructor() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  onIntervalTimer() {
    this.onAction.emit({action:HomeAction.IntervalTimer});
  }
}
