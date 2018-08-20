import { Component } from '@angular/core';

/**
 * Generated class for the ActiverestRendererComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'activerest-renderer',
  templateUrl: 'activerest-renderer.html'
})
export class ActiverestRendererComponent {

  text: string;

  constructor() {
    console.log('Hello ActiverestRendererComponent Component');
    this.text = 'Hello World';
  }

}
