import { Injectable } from '@angular/core';

import { Notification, Observable } from 'rxjs';
import { dematerialize, publish } from 'rxjs/operators';

/**
Root Component will inject this service and do the following:
  this.homeservice.observable.subscribe({
    complete: () => {
        this.createComponentForLeftMenu();
    }
  });

Feature Component will inject this service and do the following:
  this.homeservice.notifiyAppOfCompletion();
*/
@Injectable({
  providedIn: 'root',
})
export class HomeDisplayService {

  private source;

  public get observable(): Observable<any> {
    return this.source;
  }

  constructor() {
    /*     this.source = Observable.from([
          Notification.createComplete()
        ]).pipe(
          dematerialize(),
          publish()
        ); */
  }

  // may be called after complete Notification; no exceptions will be thrown.
  notifiyAppOfCompletion(): void {
    this.source.connect();
  }
}
