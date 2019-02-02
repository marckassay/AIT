import { Injectable } from '@angular/core';
import { AudioManagement } from '@ionic-native/audio-management/ngx';

import { MockStorageData } from '../services/storage/ait-storage.defaultdata';
import { AITStorage } from '../services/storage/ait-storage.service';
import { AudioMockStorageData, VolumeShape } from '../services/storage/ait-storage.shapes';

@Injectable()
export class AudioManagementMock {

    data: AudioMockStorageData;

    private _storage: AITStorage;
    public get storage(): AITStorage {
        return this._storage;
    }
    public set storage(value: AITStorage) {
        this._storage = value;
        this._storage.getPromiseSubject<AudioMockStorageData>(MockStorageData.AUDIO_MOCK_STORAGE_ID)
            .then((val) => {
                return val;
            })
            .then((val) => {
                val.subscribe((data) => { this.data = data; });
                val.unsubscribe();
            });
    }

    setAudioMode(mode: AudioManagement.AudioMode): Promise<void> {
        this.data.currentAudioMode = mode;
        return new Promise((resolve, reject): void => {
            console.log('[AudioManagementMock]', 'audio mode has been set:', mode);
            resolve();
        });
    }

    getAudioMode(): Promise<AudioManagement.AudioModeReturn> {
        return new Promise((resolve, reject): void => {
            const results = { audioMode: this.data.currentAudioMode, label: AudioManagement.AudioMode[this.data.currentAudioMode] };
            console.log('[AudioManagementMock]', 'audio mode is:', results);
            resolve(results);
        });
    }

    setVolume(type: AudioManagement.VolumeType, volume: number): Promise<void> {
        this.data[this.volTypeToField(type)] = volume;
        return new Promise((resolve, reject): void => {
            console.log('[AudioManagementMock]', this.volTypeToField(type), 'volume type has been set to:', volume);
            resolve();
        });
    }

    getVolume(type: AudioManagement.VolumeType): Promise<{ volume: number }> {
        return new Promise((resolve, reject): void => {
            const field = this.volTypeToField(type);
            const val = this.data[field];
            console.log('[AudioManagementMock]', 'volume for', field, 'is:', val);
            resolve({ volume: val });
        });
    }

    getMaxVolume(type: AudioManagement.VolumeType): Promise<{ maxVolume: number }> {
        return new Promise((resolve, reject): void => {
            const field = this.volTypeToField(type, true);
            const val = this.data[field];
            console.log('[AudioManagementMock]', 'max volume for', field, 'is:', val);
            resolve({ maxVolume: val });
        });
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
    private volTypeToField(type: AudioManagement.VolumeType, asMaxVol: boolean = false): keyof VolumeShape {
        let field: keyof VolumeShape;

        switch (type) {
            case AudioManagement.VolumeType.RING: field = 'ringVolume'; break;
            case AudioManagement.VolumeType.MUSIC: field = 'musicVolume'; break;
            case AudioManagement.VolumeType.NOTIFICATION: field = 'notificationVolume'; break;
            case AudioManagement.VolumeType.SYSTEM: field = 'systemVolume'; break;
        }

        if (asMaxVol) {
            field = field.replace(/(?=Volume)/, 'Max') as keyof VolumeShape;
        }
        return field;
    }
}
