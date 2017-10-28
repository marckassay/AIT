import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ThemeSettingsProvider {

    private theme: BehaviorSubject<string>;

    constructor() {
        this.theme = new BehaviorSubject('app-theme-light');
    }

    setCombinedTheme(val) {
      this.theme.next(val);
    }

    get combinedTheme() {
      return this.theme.asObservable();
    }
}
