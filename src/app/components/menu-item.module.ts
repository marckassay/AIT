import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MenuItemComponent } from './menu-item.component';

@NgModule({
    declarations: [
        MenuItemComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [MenuItemComponent]
})
export class MenuItemModule { }
