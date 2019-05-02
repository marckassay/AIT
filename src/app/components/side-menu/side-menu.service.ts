import { Injectable, Injector } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NextObserver, Subject, Subscription } from 'rxjs';
import { error, log } from 'src/app/app.utils';

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
  // The '*' value is for this hack: https://github.com/ionic-team/ionic/issues/16002
  subject: 'start' | 'end' | '*';
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

    // TODO: look into using `@HostListener` as an alternative to what is below:

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

  async enableMenus(value: boolean): Promise<void> {
    await this.enableLeftMenu(value);
    await this.enableRightMenu(value);

    return Promise.resolve();
  }

  enableLeftMenu(value: boolean): Promise<void> {
    return Promise.all([
      this.menuCtrl.enable(value, 'start')])
      .then(() => {
        return Promise.resolve();
      })
      .catch((reason) => {
        error(reason);
      });
  }

  enableRightMenu(value: boolean): Promise<void> {
    return Promise.all([
      this.menuCtrl.enable(value, 'end')])
      .then(() => {
        return Promise.resolve();
      })
      .catch((reason) => {
        error(reason);
      });
  }

  openLeftMenu(): Promise<boolean> {
    return this.menuCtrl.open('start')
      .then((value) => {
        return Promise.resolve<boolean>(value);
      });
  }

  openRightMenu(): Promise<boolean> {
    return this.menuCtrl.open('end')
      .then((value) => {
        return Promise.resolve<boolean>(value);
      });
  }

  closeLeftMenu(): Promise<boolean> {
    return this.menuCtrl.close('start');
  }

  closeRightMenu(): Promise<boolean> {
    return this.menuCtrl.close('end');
  }

  private leftMenuClosed(): void {
    this.send({ subject: 'start', event: 'ionDidClose' });
  }

  private rightMenuClosed(): void {
    this.send({ subject: 'end', event: 'ionDidClose' });
  }

  // Hack for: https://github.com/ionic-team/ionic/issues/16002
  swipeGestureEnabled(): void {
    this.send({ subject: '*', response: true, uuid: '' });
  }
  // Broken: https://github.com/ionic-team/ionic/issues/16002
  private swipeGesture(value: boolean, id: 'start' | 'end'): Promise<void> {
    return this.menuCtrl.get(id)
      .then((element) => {
        element.swipeGesture = value;
        return Promise.resolve();
      })
      .catch((reason) => {
        error(reason);
      });
  }
}
