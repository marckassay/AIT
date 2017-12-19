import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

export enum AccentTheme {
  Monokai,
  RGBandY
}

export enum BaseTheme {
  Dark,
  Light
}

@Injectable()
export class ThemeSettingsProvider {
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

  get combinedTheme(): Observable<string> {
    return this.theme.asObservable();
  }
}
