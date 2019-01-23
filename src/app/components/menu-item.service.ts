import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends Subject<any> {
  constructor() {
    super();
  }
}
// TODO; IntervalMenuItemService?
