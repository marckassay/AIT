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
  public actions = HomeAction;

  @Output()
  onAction = new EventEmitter<HomeEmission>();

  constructor() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  actionRequest(action:HomeAction) {
    this.onAction.emit({action: action});
  }
}
