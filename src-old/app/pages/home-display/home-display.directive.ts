/* tslint:disable:member-ordering */
import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { HomeAction, HomeEmission } from './home-display';
/*
<page-home-display (onAction)="onHomeAction($event)" > </page-home-display>
*/
@Directive({
  selector: 'page-home-display (onAction)'
})
export class HomeDisplayDirective {

  constructor(private el: ElementRef) { }
  // this.el.nativeElement.style.backgroundColor = color;
}
