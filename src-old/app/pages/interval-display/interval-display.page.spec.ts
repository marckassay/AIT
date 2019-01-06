import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalDisplayPage } from './interval-display.page';

describe('IntervalDisplayPage', () => {
  let component: IntervalDisplayPage;
  let fixture: ComponentFixture<IntervalDisplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalDisplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalDisplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
