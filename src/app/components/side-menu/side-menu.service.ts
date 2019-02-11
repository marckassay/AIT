import { Injectable, Injector } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NextObserver, Subject, Subscription } from 'rxjs';

export interface OnClosed {
  smOnClosed(): void;
}

export interface SideMenuLoadRequest {
  subject: 'start' | 'end';
  request: 'load';
  uuid: string;
  component: any;
  injector: Injector;
}

export interface SideMenuStatusRequest {
  subject: 'start' | 'end';
  request: 'status';
  uuid: string;
}

export interface SideMenuStatusResponse {
  subject: 'start' | 'end';
  /**
   * If `true`, the `subject` menu has been loaded. Otherwise `false`
   */
  response: boolean;
  uuid: string;
}

export interface SideMenuEvent {
  subject: 'start' | 'end';
  event: 'ionDidClose';
}

export type SideMenuShapes = SideMenuLoadRequest | SideMenuStatusRequest | SideMenuStatusResponse | SideMenuEvent;

@Injectable({
  providedIn: 'root'
})
/**
 * Sends and listens SideMenuShapes. Registers 'ionDidClose' event listener for start and end menu.
 * The SideMenuComponent handles component and DOM placement.
 */
export class SideMenuService {

  private subject: Subject<SideMenuShapes>;

  constructor(protected menuCtrl: MenuController) { }

  private initSelf(): void {
    this.subject = new Subject<SideMenuShapes>();

    this.menuCtrl.get('start').then((element: HTMLIonMenuElement) => {
      element.addEventListener('ionDidClose', () => this.leftMenuClosed());
    });

    this.menuCtrl.get('end').then((element: HTMLIonMenuElement) => {
      element.addEventListener('ionDidClose', () => this.rightMenuClosed());
    });
  }

  send(value: SideMenuShapes): void {
    if (this.subject === undefined) {
      this.initSelf();
    }

    this.subject.next(value);
  }

  listen(value: NextObserver<SideMenuShapes>): Subscription {
    if (this.subject === undefined) {
      this.initSelf();
    }

    return this.subject.subscribe(value);
  }

  enableLeftMenu(value: boolean): Promise<HTMLIonMenuElement> {
    return this.menuCtrl.enable(value, 'start');
  }

  enableRightMenu(value: boolean): Promise<HTMLIonMenuElement> {
    return this.menuCtrl.enable(value, 'end');
  }

  openLeftMenu(): Promise<boolean> {
    return this.menuCtrl.open('start');
  }

  openRightMenu(): Promise<boolean> {
    return this.menuCtrl.open('end');
  }

  closeLeftMenu(): Promise<boolean> {
    return this.menuCtrl.close('start');
  }

  closeRightMenu(): Promise<boolean> {
    return this.menuCtrl.close('end');
  }

  leftMenuClosed(): void {
    this.send({ subject: 'start', event: 'ionDidClose' });
  }

  rightMenuClosed(): void {
    this.send({ subject: 'end', event: 'ionDidClose' });
  }
}
