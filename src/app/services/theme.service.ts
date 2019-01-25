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
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppStorageData } from './storage/ait-storage.interfaces';

export enum AccentTheme {
  Monokai,
  RGBandY,
  CoolGrey
}

export enum BaseTheme {
  Dark,
  Light
}

@Injectable()
export class ThemeService {
  private theme: BehaviorSubject<string>;
  _accent: AccentTheme;
  _base: BaseTheme;

  constructor() {
    this._accent = AccentTheme.Monokai;
    this._base = BaseTheme.Dark;

    this.setCombinedTheme();
  }

  set accent(value: AccentTheme) {
    this._accent = value;

    if (this.theme) {
      this.setCombinedTheme();
    }
  }

  set base(value: BaseTheme) {
    this._base = value;

    if (this.theme) {
      this.setCombinedTheme();
    }
  }

  private setCombinedTheme() {
    const combined: string = 'theme-' + BaseTheme[this._base] + '-' + AccentTheme[this._accent];

    if (!this.theme) {
      this.theme = new BehaviorSubject(combined.toLowerCase());
    } else {
      this.theme.next(combined.toLowerCase());
    }
  }

  theme$(data: AppStorageData): Observable<string> {
    this._accent = data.accent;
    this._base = data.base;
    this.setCombinedTheme();

    return this.theme.asObservable();
  }
}
