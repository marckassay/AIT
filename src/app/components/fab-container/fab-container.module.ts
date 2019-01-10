import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FabContainerComponent } from './fab-container';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FabContainerComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FabContainerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FabContainerComponentModule { }
