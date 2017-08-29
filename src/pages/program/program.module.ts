import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgramPage } from './program';

@NgModule({
  declarations: [
    ProgramPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgramPage),
  ],
})
export class ProgramPageModule {}
