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

  private loadedUuid: string;

  constructor(protected subject: SideMenuService) { }

  ngOnInit(): void {
    this.subject.subscribe((note) => {
      if (note as SideMenuRequest) {
        note = (note as SideMenuRequest);

        // since the SideMenuService is multicasting, make sure we are in the correct instance
        // of SideMenuComponent by checking this.id
        if (this.id === note.subject) {
          if (note.request === 'load') {
            this.menu.clear();

            const results = this.menu.createComponent(note.component);
            (results.instance as any).uuid = note.uuid;
            (results.instance as any).injector = note.injector;
            this.loadedUuid = note.uuid;
          } else if (note.request === 'status') {
            this.subject.next({
              subject: this.id,
              uuid: this.loadedUuid,
              response: this.isComponentLoaded(note.uuid) ? 'loaded' : 'unloaded'
            });
          }
        }
      }
    });
  }

  isComponentLoaded(uuid: string): boolean {
    return this.loadedUuid === uuid;
  }
}
