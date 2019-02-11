import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { OnClosed, SideMenuEvent, SideMenuLoadRequest, SideMenuService, SideMenuShapes, SideMenuStatusRequest } from './side-menu.service';

export interface CacheViewRef {
  uuid: string;
  index: number;
  componentRef: ComponentRef<any>;
  attached: boolean;
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

  private views: Array<CacheViewRef>;
  private currentlyAttached: CacheViewRef;

  constructor(protected menuSvc: SideMenuService) {
    this.views = [];
  }

  ngOnInit(): void {
    this.menuSvc.listen({
      next: (note: SideMenuShapes): void => {
        if (this.id === note.subject) {
          if ('request' in note) {
            // since the SideMenuService is multicasting, make sure we are in the correct instance
            // of SideMenuComponent by checking this.id
            if (note.request === 'load') {
              note = note as SideMenuLoadRequest;

              if (this.isComponentCached(note.uuid) === false) {
                this.attachComponent(note);
              } else if (this.isComponentAttached(note.uuid) === false) {
                this.reattachComponent(note.uuid);
              }

              this.menuSvc.send({
                subject: this.id,
                uuid: note.uuid,
                response: true
              });
            } else if (note.request === 'status') {
              note = note as SideMenuStatusRequest;

              // console.log(this.id, note.uuid, this.isComponentAttached(note.uuid));

              this.menuSvc.send({
                subject: this.id,
                uuid: note.uuid,
                response: this.isComponentAttached(note.uuid)
              });
            }
          } else if ('event' in note) {
            note = note as SideMenuEvent;
            this.callComponentOnCloseMethod();
          }
        }
      }
    });
  }

  isComponentAttached(uuid: string): boolean {
    const component = this.getAttached();
    return (component !== undefined) && (component.uuid === uuid);
  }

  private isComponentCached(uuid: string): boolean {
    return this.views.findIndex(value => value.uuid === uuid) >= 0;
  }

  private getAttached(): CacheViewRef | undefined {
    return this.views.find(value => value.attached);
  }

  private getCache(uuid: string): CacheViewRef {
    let component: CacheViewRef;
    this.views.forEach((value: CacheViewRef) => {
      if (value.uuid === uuid) {
        component = value;
      } else {
        value.attached = false;
      }
    });
    return component;
  }

  private setCache(value: ComponentRef<unknown>): void {
    this.views.forEach((val: CacheViewRef) => val.attached = false);
    const component: CacheViewRef = { uuid: (value.instance as any).uuid, index: this.views.length, componentRef: value, attached: true };
    this.views.push(component);
  }

  private reattachComponent(uuid: string): void {
    const component = this.getCache(uuid);
    component.attached = true;
    this.menu.detach();
    this.menu.insert(component.componentRef.instance);
    // this.menu.insert(component.hostView, this.menu.length);
    // component.hostView.reattach();
    // To ensure that the compiler still generates a factory, add dynamically loaded components to the NgModule's entryComponents array:
  }

  private attachComponent(note: SideMenuLoadRequest): void {
    if (this.menu.length) {
      this.menu.detach();
    }

    const component: ComponentRef<unknown> = this.menu.createComponent(note.component);
    (component.instance as any).uuid = note.uuid;
    (component.instance as any).injector = note.injector;

    this.setCache(component);
  }

  private callComponentOnCloseMethod(): void {
    const component = this.getAttached();
    if (component && component.componentRef.instance.smOnClosed) {
      (component.componentRef.instance as OnClosed).smOnClosed();
    }
  }
}
