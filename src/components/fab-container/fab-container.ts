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
  Completed = 2,
  Start = 4,
  Pause = 8,
  ProgramEnabled = 16,
  HomeEnabled = 32,
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
  @Input('viewState')
  set viewState(value: FabState) {
    this._viewState = value;
  }

  public actions = FabAction;

  constructor() {
    this._viewState = FabState.Start;
  }

  actionRequest(action: FabAction, fabMenu: FabContainer) {
    if (action === FabAction.Start) {
      this.viewState = FabState.Pause;
    } else if ((action === FabAction.Pause) || (action === FabAction.Reset)) {
      this.viewState = FabState.Start;
    }

    if (action !== FabAction.Main) {
      this.onAction.emit({ action: action, container: fabMenu });
    }
  }

  reset(): void {
    this.viewState = FabState.Start;
  }

  completed(): void {
    this.viewState = FabState.Completed;
  }

  isHomeEnabled() {
    return this.viewState & FabState.HomeEnabled;
  }
}
