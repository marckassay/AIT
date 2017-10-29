import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ThemeSettingsProvider {

    private theme: BehaviorSubject<string>;

    constructor() {
        this.theme = new BehaviorSubject('theme-light');
    }

    setCombinedTheme(value: string) {
      this.theme.next(value);
    }

    get combinedTheme() {
      return this.theme.asObservable();
    }
}
