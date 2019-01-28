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
  private _app: BehaviorSubject<AppStorageData>;
  public get app(): BehaviorSubject<AppStorageData> {
    return this._app;
  }
  public set app(value: BehaviorSubject<AppStorageData>) {
    this._app = value;

    this.subscribeApp();
  }
  private theme: BehaviorSubject<string>;

  private _accent: AccentTheme;
  private _base: BaseTheme;

  constructor() {
    this._accent = AccentTheme.Monokai;
    this._base = BaseTheme.Dark;
  }

  private subscribeApp() {
    this.app.subscribe((value) => {
      this.base = value.base;
      this.accent = value.accent;
    });
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

  theme$(): Observable<string> {
    this.setCombinedTheme();
    return this.theme.asObservable();
  }
}
