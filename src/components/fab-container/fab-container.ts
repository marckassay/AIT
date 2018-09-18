/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FabContainer } from 'ionic-angular';

export interface FabEmission {
  action: FabAction;
  container: FabContainer;
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
  Loading = 1,
  Ready = 1 << 2,
  Running = 1 << 3,
  Completed = 1 << 4,
  ProgramVisible = 1 << 5,
  HomeVisible = 1 << 6
}

@Component({
  selector: 'fab-container',
  templateUrl: 'fab-container.html'
})
export class FabContainerComponent {
  @Output()
  onAction = new EventEmitter<FabEmission>();

  public states = FabState;
  _viewState: FabState;
  get viewState(): FabState {
    return this._viewState;
  }
  set viewState(value: FabState) {
    this._viewState = value;
  }

  // this is for template can access FabAction enum members
  public actions = FabAction;

  constructor() { }

  actionRequest(action: FabAction, fabMenu: FabContainer) {
    // if action is Start, which only exists in the Ready state, set the state to Running
    if (action === FabAction.Start) {
      this.setToRunningMode();
    } else if ((action === FabAction.Pause) || (action === FabAction.Reset)) {
      this.setToReadyMode();
    }

    if (action !== FabAction.Main) {
      this.onAction.emit({ action: action, container: fabMenu });
    }
  }

  /*
  Public methods to set viewState to modes and by preserving 'secondary' modes specifically; Home
  Program
  */
  setToLoadedMode(): void {
    this.viewState |= FabState.Loading;
    this.setToReadyMode();
  }

  private setToReadyMode(): void {
    if ((this.viewState & FabState.Loading) || (this.viewState & FabState.Completed)) {
      this.viewState &= ~FabState.Loading;
      this.viewState &= ~FabState.Completed;

      this.viewState |= FabState.Ready;
    }
  }

  private setToRunningMode(): void {
    if (this.viewState & FabState.Ready) {
      this.viewState &= ~FabState.Ready;

      this.viewState |= FabState.Running;
    }
  }

  setToCompletedMode(): void {
    if (this.viewState & FabState.Running) {
      this.viewState &= ~FabState.Running;

      this.viewState |= FabState.Completed;
    }
  }

  setHomeButtonToVisible(): void {
    this.viewState |= FabState.HomeVisible;
  }

  setProgramButtonToVisible(): void {
    this.viewState |= FabState.ProgramVisible;
  }

  /*
  The following 'isX' properties are for the template to evaluate what buttons are to be shown.
  */
  public get isStartVisible() {
    return (this.viewState & FabState.Ready) > 0;
  }

  public get isPauseVisible() {
    return (this.viewState & FabState.Running) > 0;
  }

  public get isResetVisible() {
    return ((this.viewState & FabState.Running) > 0 || (this.viewState & FabState.Completed) > 0);
  }

  public get isProgramVisible() {
    return (this.viewState & FabState.ProgramVisible) > 0;
  }

  public get isHomeVisible() {
    return (this.viewState & FabState.HomeVisible) > 0;
  }
}
