import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

export enum HomeAction {
  IntervalTimer,
  Timer,
  Stopwatch,
  Settings
}

export interface HomeEmission {
  action: HomeAction;
}

@Component({
  selector: 'page-home-display',
  templateUrl: 'home-display.html',
  encapsulation: ViewEncapsulation.None
})
export class HomeDisplayPage {
  public actions = HomeAction;

  @Output()
  onAction = new EventEmitter<HomeEmission>();

  actionRequest(action: HomeAction) {
    this.onAction.emit({ action: action });
  }
}
