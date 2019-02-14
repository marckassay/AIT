import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { XProgressBarComponent } from 'src/app/components/x-progress-bar/x-progress-bar.component';

@NgModule({
    declarations: [
        XProgressBarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [XProgressBarComponent]
})

/**
 * As of now, ionic-progress-bar is incomplete hence XProgressBarModule
 */
export class XProgressBarModule { }
