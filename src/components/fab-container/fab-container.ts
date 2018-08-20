import { Component } from '@angular/core';

/**
 * Generated class for the FabContainerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'fab-container',
  templateUrl: 'fab-container.html'
})
export class FabContainerComponent {

  text: string;

  constructor() {
    console.log('Hello FabContainerComponent Component');
    this.text = 'Hello World';
  }

}
