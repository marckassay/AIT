import { AudioManagement } from "@ionic-native/audio-management";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

export interface MockStorageShape {
  uuid: string;
  currentAudioMode: number;
  ringVolume: number;
  ringMaxVolume: number;
  musicVolume: number;
  musicMaxVolume: number;
  notificationVolume: number;
  notificationMaxVolume: number;
  systemVolume: number;
  systemMaxVolume: number;
}

const storage_shape: MockStorageShape = {
  uuid: this.MOCK_STORAGE_KEY,
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

type AudioModeReturn = { mode: AudioManagement.AudioMode, label: string };

@Injectable()
class AudioManagementMock extends AudioManagement {
  private readonly MOCK_STORAGE_KEY: string = '1e715c37-c09e-49a7-84e6-950fa447e45a';
  private ready: Promise<boolean>;

  constructor(public storage: Storage) {
    super();
  }

  private isReady(): Promise<boolean> {
    if (this.ready) {
      return this.ready;
    } else {
      return this.storage.ready()
        .then((): Promise<MockStorageShape | undefined> => {
          return this.storage.get(this.MOCK_STORAGE_KEY);
        })
        .then((value: MockStorageShape | undefined) => {
          if (!value) {
            console.log("AudioManagementMock is setting mock data.");
            return this.storage.set(this.MOCK_STORAGE_KEY, storage_shape).then((value: MockStorageShape) => {
              this.ready = new Promise<boolean>((resolve, reject) => { resolve(true); });
              return this.ready;
            });
          } else {
            console.log("AudioManagementMock successfully retrieved data.");
            this.ready = new Promise<boolean>((resolve, reject) => { resolve(true); });
            return this.ready;
          }
        });
    }
  }

  private volTypeToField(type: AudioManagement.VolumeType, asMaxVol: boolean = false): keyof MockStorageShape {
    let field: keyof MockStorageShape;

    switch (type) {
      case AudioManagement.VolumeType.Ring: field = "ringVolume"; break;
      case AudioManagement.VolumeType.Music: field = "musicVolume"; break;
      case AudioManagement.VolumeType.Notification: field = "notificationVolume"; break;
      case AudioManagement.VolumeType.System: field = "systemVolume"; break;
    }

    if (asMaxVol) {
      field = field.replace(/(?=Volume)/, 'Max') as keyof MockStorageShape;
    }
    return field;
  }

  getMock(): Promise<MockStorageShape> {
    return this.isReady().then((value) => {
      if (value) {
        return this.storage.get(this.MOCK_STORAGE_KEY) as Promise<MockStorageShape>;
      }
    });
  }

  setMock(field: keyof MockStorageShape, value?: number): Promise<void> {
    return this.getMock().then((val: MockStorageShape) => {
      val[field] = value;
      return this.storage.set(this.MOCK_STORAGE_KEY, val).then(() => {
        return new Promise<void>((resolve, reject) => { resolve(); });
      });
    });
  }

  setAudioMode(mode: AudioManagement.AudioMode, onSuccess: () => void, onError?: () => void): Promise<void> {
    return this.setMock('currentAudioMode', mode).then(onSuccess, onError);
  }
  getAudioMode(onSuccess: (result: AudioModeReturn) => void, onError?: () => void): Promise<AudioModeReturn> {
    return this.getMock().then((value: MockStorageShape) => {
      const val = { mode: value.currentAudioMode, label: AudioManagement.AudioMode[value.currentAudioMode] };
      return new Promise<AudioModeReturn>((onSuccess, onError) => { onSuccess(val); });
    });
  }

  setVolume(type: AudioManagement.VolumeType, volume: number, onSuccess: () => void, onError?: () => void): Promise<any> {
    return this.setMock(this.volTypeToField(type), volume).then(onSuccess, onError);
  }

  getVolume(type: AudioManagement.VolumeType, onSuccess: (result: {
    volume: number;
  }) => void, onError?: () => void): Promise<any> {
    return this.getMock().then((value: MockStorageShape) => {
      const val = { volume: value[this.volTypeToField(type)] as number };
      return new Promise<{ volume: number }>((onSuccess, onError) => { onSuccess(val); });
    });
  }

  getMaxVolume(type: AudioManagement.VolumeType, onSuccess: (result: {
    volume: number;
  }) => void, onError?: () => void): Promise<any> {
    return this.getMock().then((value: MockStorageShape) => {
      const val = { volume: value[this.volTypeToField(type)] as number };
      return new Promise<{ volume: number }>((onSuccess, onError) => { onSuccess(val); });
    });
  }
}
