import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActiverestRendererComponent } from './activerest-renderer';

@NgModule({
  declarations: [
    ActiverestRendererComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ActiverestRendererComponent
  ]
})
export class ActiverestRendererComponentModule { }
