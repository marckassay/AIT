import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDisplayPage } from './timer-display.page';

describe('TimerDisplayPage', () => {
  let component: TimerDisplayPage;
  let fixture: ComponentFixture<TimerDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
