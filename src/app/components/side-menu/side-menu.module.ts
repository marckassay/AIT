import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SideMenuComponent } from './side-menu.component';

@NgModule({
    declarations: [
        SideMenuComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [SideMenuComponent]
})

/**
 * This module constituents are a start and end component instance with a singleton service. Since
 * service needs to know what instance its working with, the `id` property of this module's
 * component is used for that purpose.
 *
 * It's important to remember that there are a total of 3 subscribers: `AppComponent`, `AITBasePage`
 * and `SideMenuComponent`.
 *
 * If log statements are place in `AppComponent` and `AITBasePage` with 'app' and 'aitbase' 
 * respectively as first parameters, the algorthim should come out as the following on lauching AIT:
 *
 *  aitbase 1 requesting end menu to be loaded
 *  aitbase 2 requesting start menu status
 *  app 3 received start status request
 *  app 4 responding start menu status of: unloaded
 *  app 5 requesting start menu to be loaded
 *  aitbase 6 received start menu has been loaded
 */
export class SideMenuModule { }
