import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiverestRendererComponent } from './activerest-renderer';

@NgModule({
  declarations: [
    ActiverestRendererComponent,
  ],
  imports: [
    IonicPageModule.forChild(ActiverestRendererComponent),
  ],
  exports: [
    ActiverestRendererComponent
  ]
})
export class ActiverestRendererComponentModule { }
