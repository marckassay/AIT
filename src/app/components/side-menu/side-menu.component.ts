import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { SideMenuRequest, SideMenuService } from './side-menu.service';

@Component({
  selector: 'side-menu',
  template: '<ng-template #menu></ng-template>'
})
export class SideMenuComponent implements OnInit {
  @ViewChild('menu', { read: ViewContainerRef })
  protected menu: ViewContainerRef;

  @Input()
  id: 'start' | 'end';

  hasBeenLoaded: boolean;

  constructor(protected subject: SideMenuService) { }

  ngOnInit(): void {
    this.subject.subscribe((note) => {
      if ((note as SideMenuRequest).request !== undefined) {
        note = (note as SideMenuRequest);
        if (this.id === note.subject) {
          if (note.request === 'load') {
            this.menu.clear();
            const results = this.menu.createComponent(note.component);
            this.hasBeenLoaded = results !== undefined;
            this.subject.next({ subject: this.id, response: (this.hasBeenLoaded) ? 'loaded' : 'unloaded' });
          } else if (note.request === 'status') {
            this.subject.next({ subject: this.id, response: (this.hasBeenLoaded) ? 'loaded' : 'unloaded' });
          }
        }
      }
    });
  }
}
