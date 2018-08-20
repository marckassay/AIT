import { NgModule } from '@angular/core';
import { ActiverestRendererComponent } from './activerest-renderer/activerest-renderer';
import { FabContainerComponent } from './fab-container/fab-container';
@NgModule({
	declarations: [ActiverestRendererComponent,
    FabContainerComponent],
	imports: [],
	exports: [ActiverestRendererComponent,
    FabContainerComponent]
})
export class ComponentsModule {}
