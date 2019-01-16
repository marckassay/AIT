import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FabContainerComponent } from './fab-container';

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
