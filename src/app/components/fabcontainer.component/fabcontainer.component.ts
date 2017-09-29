import { Component, Output, EventEmitter } from '@angular/core';
import { FabContainer } from 'ionic-angular';

export interface FabEmission {
  action: FabAction
  container: FabContainer
}

export enum FabAction {
  Main,
  Start,
  Pause,
  Program,
  Reset,
  Home
}

export enum FabState {
  Start,
  Pause
}

@Component({
  selector: 'fab-container',
  templateUrl: 'fabcontainer.component.html'
})
export class FabContainerComponent {
  @Output() onAction = new EventEmitter<FabEmission>();

  _viewState: FabState;
  get viewState(): FabState {
    return this._viewState;
  }
  set viewState (value:FabState) {
    this._viewState = value;
  }

  public states = FabState;
  public actions = FabAction;

  constructor () {
    this._viewState = FabState.Start;
  }

  actionRequest(action: FabAction, fabMenu: FabContainer) {
    if(action == FabAction.Start) {
      this.viewState = FabState.Pause;
    } else if(action == FabAction.Pause) {
      this.viewState = FabState.Start;
    }

    if(action != FabAction.Main) {
      this.onAction.emit({action: action, container: fabMenu});
    }
  }

  reset(): void {
    this.viewState = FabState.Start;
  }
}
