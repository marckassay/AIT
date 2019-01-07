import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopwatchDisplayPage } from './stopwatch-display.page';

describe('StopwatchDisplayPage', () => {
  let component: StopwatchDisplayPage;
  let fixture: ComponentFixture<StopwatchDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopwatchDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopwatchDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
