import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SideMenuRequest {
  subject: 'start' | 'end';
  request: 'load' | 'status';
  uuid: string;
  component?: any;
}

export interface SideMenuResponse {
  subject: 'start' | 'end';
  response: 'unloaded' | 'loaded' | 'closing';
  uuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class SideMenuService<T = SideMenuRequest | SideMenuResponse> extends Subject<T> {
  constructor() {
    super();
  }
}
