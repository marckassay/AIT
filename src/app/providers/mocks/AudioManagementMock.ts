import { AudioManagement } from '@ionic-native/audio-management';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


export interface AudioModeShape {
  currentAudioMode: number;
}

export interface VolumeShape {
  ringVolume: number;
  ringMaxVolume: number;
  musicVolume: number;
  musicMaxVolume: number;
  notificationVolume: number;
  notificationMaxVolume: number;
  systemVolume: number;
  systemMaxVolume: number;
}

export type MockStorageShape = AudioModeShape & VolumeShape;

@Injectable()
export class AudioManagementMock extends AudioManagement {
  protected readonly MOCK_STORAGE_KEY: string = '1e715c37-c09e-49a7-84e6-950fa447e45a';
  private ready: Promise<boolean> | undefined;
  protected storage_shape: MockStorageShape = {
    currentAudioMode: 2,
    ringVolume: 5,
    ringMaxVolume: 8,
    musicVolume: 5,
    musicMaxVolume: 8,
    notificationVolume: 5,
    notificationMaxVolume: 8,
    systemVolume: 5,
    systemMaxVolume: 8
  };

  constructor(public storage: Storage) {
    super();
  }

  setAudioMode(mode: AudioManagement.AudioMode, onSuccess?: () => void, onError?: () => void): Promise<void> {
    return this.setMock('currentAudioMode', mode).then(onSuccess, onError);
  }
  getAudioMode(onSuccess?: (result: AudioManagement.AudioModeReturn) => void, onError?: () => void): Promise<any> {
    return this.getMock().then((value) => {
      const val = { mode: value.currentAudioMode, label: AudioManagement.AudioMode[value.currentAudioMode] };
      if (onSuccess) {
        onSuccess(val);
      } else {
        return Promise.resolve(val);
      }
    }, () => {
      return Promise.resolve(onError());
    });
  }

  setVolume(type: AudioManagement.VolumeType, volume: number, onSuccess?: () => void, onError?: () => void): Promise<any> {
    return this.setMock(this.volTypeToField(type), volume).then(onSuccess, onError);
  }

  getVolume(type: AudioManagement.VolumeType,
    onSuccess?: (result: AudioManagement.VolumeTypeReturn) => void,
    onError?: () => void): Promise<any> {
    return this.getMock().then((value) => {
      const val = { volume: value[this.volTypeToField(type)] as number };
      if (onSuccess) {
        onSuccess(val);
      } else {
        return Promise.resolve(val);
      }
    }, () => {
      return Promise.resolve(onError());
    });
  }

  getMaxVolume(type: AudioManagement.VolumeType,
    onSuccess?: (result: AudioManagement.VolumeTypeReturn) => void,
    onError?: () => void): Promise<any> {
    return this.getMock().then((value) => {
      const val = { volume: value[this.volTypeToField(type, true)] as number };
      if (onSuccess) {
        onSuccess(val);
      } else {
        return Promise.resolve(val);
      }
    }, () => {
      return Promise.resolve(onError());
    });
  }

  /**
   * Ensures that `storage` is ready to be used before any of the public get and set methods are
   * called. Once `storage` is ready, it will attempt to retrieve `MockStorageShape` data using the
   * `MOCK_STORAGE_KEY` as its id.
   */
  protected isReady(): Promise<boolean> {
    if (this.ready) {
      return this.ready;
    } else {
      return this.storage.ready()
        .then((): Promise<MockStorageShape | undefined> => {
          return this.storage.get(this.MOCK_STORAGE_KEY);
        })
        .then((value: MockStorageShape | undefined) => {
          if (!value) {
            console.log('AudioManagementMock is setting mock data.');
            return this.storage.set(this.MOCK_STORAGE_KEY, this.storage_shape).then((val: MockStorageShape) => {
              this.ready = Promise.resolve<boolean>(true);
              return this.ready;
            });
          } else {
            console.log('AudioManagementMock successfully retrieved data.');
            this.ready = Promise.resolve<boolean>(true);
            return this.ready;
          }
        })
        .catch((reason: any) => {
          console.error('AudioManagementMock failed to retrieved data.' + reason);
          this.ready = undefined;
          return Promise.resolve<boolean>(false);
        });
    }
  }

  /**
   * A utility method that maps the numeric value of `type` to the string value of
   * `MockStorageShape`.
   *
   * @param type the source to map from.
   * @param asMaxVol As every `AudioManagement.VolumeType` member has a corresponding 'Max' member
   * that is used to set the upper limit of the device, this parameter is used to signify the return
   * key of `MockStorageShape` should be that member.
   */
  protected volTypeToField(type: AudioManagement.VolumeType, asMaxVol: boolean = false): keyof VolumeShape {
    let field: keyof VolumeShape;

    switch (type) {
      case AudioManagement.VolumeType.Ring: field = 'ringVolume'; break;
      case AudioManagement.VolumeType.Music: field = 'musicVolume'; break;
      case AudioManagement.VolumeType.Notification: field = 'notificationVolume'; break;
      case AudioManagement.VolumeType.System: field = 'systemVolume'; break;
    }

    if (asMaxVol) {
      field = field.replace(/(?=Volume)/, 'Max') as keyof VolumeShape;
    }
    return field;
  }

  /**
   * Used internally by all public get methods of this class.
   */
  protected getMock(): Promise<MockStorageShape> {
    return this.isReady().then((value) => {
      if (value) {
        return this.storage.get(this.MOCK_STORAGE_KEY) as Promise<MockStorageShape>;
      }
    });
  }


  /**
   * Used internally by all public set methods of this class. Since this class has no caching, it
   * will retrieve data, via `getMock` before setting data.
   *
   * @param field the property/field of `MockStorageShape` to set the `value` to.
   * @param value the value that will be assigned to `field`.
   */
  protected setMock(field: keyof MockStorageShape, value?: number): Promise<void> {

    // set only if there is a value. since currentAudioMode relies on the device to select the audio
    // mode, it doesn't need a value.
    if (field !== 'currentAudioMode' && value === undefined) {
      throw new Error('AudioManagementMock can\'t set a value of undefined to MockStorageShape. Only'
        + ' MockStorageShape\'s currentAudioMode field can be assigned with no value.');
    }

    return this.getMock().then((val: MockStorageShape) => {
      val[field] = value;
      return this.storage.set(this.MOCK_STORAGE_KEY, val).then(() => {
        return Promise.resolve();
      });
    });
  }
}
