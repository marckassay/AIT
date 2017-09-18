import { Component, Input } from '@angular/core';
import { FabContainer } from 'ionic-angular';
import {Icon} from 'ionic-angular';


export enum FabState {
  Start,
  Pause
}

export enum FabAction {
  Main,
  StartPause,
  Program,
  Reset,
  Home
}

@Component({
  selector: 'fab-container',
  templateUrl: 'fabcontainer.component.html'
})
export class FabContainerComponent {
  public currentState: FabState;
  @Input() states = FabState;
  @Input() actions = FabAction;

  constructor () {
    this.currentState = FabState.Pause;
  }

  actionRequest(action: FabAction, fab: FabContainer) {

    switch (action) {
      case FabAction.StartPause:
        this.currentState = (this.currentState == FabState.Pause) ? FabState.Start : FabState.Pause;
       // this.initTimer();
        break;
      case FabAction.Program:

        break;
      case FabAction.Reset:
        //this.resetTimer();
        break;
      case FabAction.Home:

        break;
    }
    fab.close();
  }
}
