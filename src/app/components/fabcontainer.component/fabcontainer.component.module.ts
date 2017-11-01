import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FabContainerComponent } from './fabcontainer.component';

@NgModule({
  declarations: [
    FabContainerComponent,
  ],
  imports: [
    IonicPageModule.forChild(FabContainerComponent),
  ],
  exports: [
    FabContainerComponent
  ]
})
export class FabContainerComponentModule {}
