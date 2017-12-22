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
  selector: 'page-home',
  templateUrl: 'home.html',
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  public actions = HomeAction;

  @Output()
  onAction = new EventEmitter<HomeEmission>();

  actionRequest(action: HomeAction) {
    this.onAction.emit({ action: action });
  }
}
