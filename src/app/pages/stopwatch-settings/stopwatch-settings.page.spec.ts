import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopwatchSettingsPage } from './stopwatch-settings.page';

describe('StopwatchSettingsPage', () => {
  let component: StopwatchSettingsPage;
  let fixture: ComponentFixture<StopwatchSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopwatchSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopwatchSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
