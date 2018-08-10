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
