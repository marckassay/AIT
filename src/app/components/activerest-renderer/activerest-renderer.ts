/*
    AIT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

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
import { Component, Input } from '@angular/core';
import { SequenceStates } from '../../services/sots/ait-sots.util';
import { Limits } from '../../services/storage/ait-storage.shapes';


@Component({
  selector: 'activerest-renderer',
  templateUrl: 'activerest-renderer.html',
  styleUrls: ['./activerest-renderer.scss']
})
export class ActiverestRendererComponent {

  // this type assignment to variable is for Angular template can access enum values.
  SS = SequenceStates;

  _state: SequenceStates;
  @Input()
  get state(): SequenceStates {
    return this._state;
  }
  set state(value: SequenceStates) {
    this._state = value;
  }

  @Input()
  limits: Limits;

  _time: number;
  get time(): number {
    return this._time;
  }
  set time(value: number) {
    this._time = value;
  }
}
