import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalSettingsPage } from './interval-settings.page';

describe('IntervalSettingsPage', () => {
  let component: IntervalSettingsPage;
  let fixture: ComponentFixture<IntervalSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
