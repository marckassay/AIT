import { Component, Input, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';

import { SideMenuLoadRequest, SideMenuService, SideMenuStatusRequest } from './side-menu.service';

export interface CacheViewRef {
  uuid: string;
  index: number;
  hostView: ViewRef;
}

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
  private views: Array<CacheViewRef>;

  constructor(protected subject: SideMenuService) {
    this.views = [];
  }

  ngOnInit(): void {
    this.subject.subscribe((note) => {
      if ('request' in note) {

        // since the SideMenuService is multicasting, make sure we are in the correct instance
        // of SideMenuComponent by checking this.id
        if (this.id === note.subject) {
          if (note.request === 'load') {
            note = (note as SideMenuLoadRequest);

            if (this.isComponentCached(note.uuid) === false) {
              this.pushComponent(note);
            } else {
              this.popComponent(note.uuid);
              this.subject.next({
                subject: this.id,
                uuid: note.uuid,
                response: true
              });
            }
          } else if (note.request === 'status') {
            note = (note as SideMenuStatusRequest);

            console.log(this.id, note.uuid, this.isComponentAttached(note.uuid));

            this.subject.next({
              subject: this.id,
              uuid: note.uuid,
              response: this.isComponentAttached(note.uuid)
            });
          }
        }
      }
    });
  }

  isComponentAttached(uuid: string): boolean {
    if (this.isComponentCached(uuid) === true) {
      const componentIndex: number = this.views.findIndex(value => value.uuid === uuid);
      try {
        console.log('tree ===>>', (this.menu.get(0) as any).rootNodes[0]);
        console.log('cache ===>>', (this.views[componentIndex].hostView as any).rootNodes[0]);
        return (this.menu.get(0) as any).rootNodes[0] === (this.views[componentIndex].hostView as any).rootNodes[0];
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }

  private popComponent(uuid: string): void {
    const component: CacheViewRef = this.views.find(value => value.uuid === uuid);
    this.menu.detach();
    component.hostView.reattach();
  }

  private pushComponent(note: SideMenuLoadRequest): void {
    this.menu.detach();

    const results = this.menu.createComponent(note.component);
    (results.instance as any).uuid = note.uuid;
    (results.instance as any).injector = note.injector;
    this.views.push({ uuid: note.uuid, index: this.views.length, hostView: results.hostView });
  }

  private isComponentCached(uuid: string): boolean {
    return this.views.findIndex(value => value.uuid === uuid) >= 0;
  }
}
