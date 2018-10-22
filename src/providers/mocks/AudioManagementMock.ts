import { AudioManagement } from "@ionic-native/audio-management";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

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

@Injectable()
class AudioManagementMock extends AudioManagement {

  readonly MOCK_STORAGE_KEY: string = '1e715c37-c09e-49a7-84e6-950fa447e45a';
  data: MockStorageShape;

  constructor(public storage: Storage) {
    super();
  }

  checkForExistingStorage(): Promise<void> {
    return this.storage.ready().then((): Promise<void> => {
      return this.storage.get(this.MOCK_STORAGE_KEY).then((value: MockStorageShape | undefined): Promise<void> => {
        if (!value) {
          let storage_shape = {
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

          console.log("AudioManagementMock is creating mock data.");
          return this.storage.set(this.MOCK_STORAGE_KEY, storage_shape).then((value: MockStorageShape) => {
            this.data = value;
            return;
          });

        } else {
          console.log("AudioManagementMock successfully retrieved data.");
          return;
        }
      });
    }, (reason: any): void => {
      console.error('Error with retrieving AudioManagementMock data.', reason);
    });
  }

  setAudioMode(mode: 0 | 1 | 2, onSuccess: () => void, onError?: () => void): Promise<any> {
    if (!this.data) {
      this.checkForExistingStorage();
    }

    return;
  }

  getAudioMode(onSuccess: (result: {
    mode: 0 | 1 | 2;
    label: string;
  }) => void, onError?: () => void): Promise<any> {
    return;
  }

  setVolume(type: 0 | 1 | 2 | 3, volume: number, onSuccess: () => void, onError?: () => void): Promise<any> {
    return;
  }

  getVolume(type: 0 | 1 | 2 | 3, onSuccess: (result: {
    volume: number;
  }) => void, onError?: () => void): Promise<any> {
    return;
  }

  getMaxVolume(type: 0 | 1 | 2 | 3, onSuccess: (result: {
    volume: number;
  }) => void, onError?: () => void): Promise<any> {
    return;
  }
}
