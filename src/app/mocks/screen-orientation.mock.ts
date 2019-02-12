import { Injectable } from '@angular/core';
import { IonicNativePlugin } from '@ionic-native/core';

@Injectable()
export class ScreenOrientationMock extends IonicNativePlugin {

  private _type = 'portrait';
  public get type(): string {
    // console.warn('ScreenOrientationMock is hard-coded to return \'portrait\' for its orientation type.');
    return this._type;
  }
  public set type(value) {
    this._type = value;
  }

  lock(orientation: string): Promise<any> {
    return new Promise((resolve): void => {
      setTimeout(() => resolve(), 250);
    });
  }

  unlock(): void { }
}
