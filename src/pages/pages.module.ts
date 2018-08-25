import { NgModule } from '@angular/core';
import { AppSettingsPage } from './app-settings/app-settings';
import { HomeDisplayPage } from './home-display/home-display';
import { ActiverestRendererComponent } from './../components/activerest-renderer/activerest-renderer';
import { FabContainerComponent } from './../components/fab-container/fab-container';
import { IonicPageModule } from 'ionic-angular';
import { IntervalDisplayPage } from './interval-display/interval-display';
import { IntervalSettingsPage } from './interval-settings/interval-settings';
import { StopwatchDisplayPage } from './stopwatch-display/stopwatch-display';
import { StopwatchSettingsPage } from './stopwatch-settings/stopwatch-settings';
import { TimerDisplayPage } from './timer-display/timer-display';
import { TimerSettingsPage } from './timer-settings/timer-settings';

const pages = [AppSettingsPage,
  HomeDisplayPage,
  IntervalDisplayPage,
  IntervalSettingsPage,
  StopwatchDisplayPage,
  StopwatchSettingsPage,
  TimerDisplayPage,
  TimerSettingsPage]

@NgModule({
  declarations: pages,
  imports: [
    ActiverestRendererComponent,
    FabContainerComponent,
    IonicPageModule.forChild(pages),
  ],
  exports: pages
})
export class ComponentsModule { }
