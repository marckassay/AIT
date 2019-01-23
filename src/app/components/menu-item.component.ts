import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MenuItemService } from './menu-item.service';

@Component({
  selector: 'menu-item-host',
  template: '<ng-template #menu></ng-template>'
})
export class MenuItemComponent implements OnInit {
  @ViewChild('menu', { read: ViewContainerRef })
  protected menu: ViewContainerRef;

  constructor(protected subject: MenuItemService) { }

  ngOnInit(): void {
    this.subject.subscribe((page) => {
      if (page) {
        this.menu.clear();
        this.menu.createComponent(page);
      }
    });
  }
}
