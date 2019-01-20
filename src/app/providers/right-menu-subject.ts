import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AITBaseSettingsPage } from '../pages/ait-basesettings.page';

@Injectable({
    providedIn: 'root'
})
export class RightMenuSubject extends Subject<typeof AITBaseSettingsPage> {

    constructor() {
        super();
    }
}
