import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';

export interface SideMenuLoadRequest {
  subject: 'start' | 'end';
  request: 'load';
  uuid: string;
  component: any;
  // Use the display-page's injector, inject it into the settings page.
  injector: Injector;
}

export interface SideMenuStatusRequest {
  subject: 'start' | 'end';
  request: 'status';
  uuid: string;
}

export interface SideMenuStatusResponse {
  subject: 'start' | 'end';
  response: boolean;
  uuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class SideMenuService<T = SideMenuLoadRequest | SideMenuStatusRequest | SideMenuStatusResponse> extends Subject<T> {
  constructor() {
    super();
  }
}
