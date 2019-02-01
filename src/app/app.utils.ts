import moment from 'moment';

import { MockStorageData, StorageDefaultData } from './services/storage/ait-storage.defaultdata';
import { AccentTheme, AppStorageData, BaseTheme, IntervalStorageData, UUIDData } from './services/storage/ait-storage.shapes';

export class AppUtils {
    /**
     * Returns the default data for ID matching to `uuid`. Default value is declared in this class as private members.
     */
    static getPageDataByID(uuid: string): UUIDData {
        switch (uuid) {
            case StorageDefaultData.APP_ID: return StorageDefaultData.APP_DATA;
            case StorageDefaultData.INTERVAL_ID: return StorageDefaultData.INTERVAL_DATA;
            case StorageDefaultData.TIMER_ID: return StorageDefaultData.TIMER_DATA;
            case StorageDefaultData.STOPWATCH_ID: return StorageDefaultData.STOPWATCH_DATA;
            case MockStorageData.AUDIO_MOCK_STORAGE_ID: return MockStorageData.AUDIO_MOCK_DATA;
        }
    }

    static getPageNameByID(uuid: string): 'settings' | 'interval' | 'timer' | 'stopwatch' {
        switch (uuid) {
            case StorageDefaultData.APP_ID: return 'settings';
            case StorageDefaultData.INTERVAL_ID: return 'interval';
            case StorageDefaultData.TIMER_ID: return 'timer';
            case StorageDefaultData.STOPWATCH_ID: return 'stopwatch';
        }
    }

    static getIDByPageName(name: 'interval' | 'timer' | 'stopwatch'): string {
        switch (name) {
            case 'interval': return StorageDefaultData.INTERVAL_ID;
            case 'timer': return StorageDefaultData.TIMER_ID;
            case 'stopwatch': return StorageDefaultData.STOPWATCH_ID;
        }
    }

    static getPageClassByID(uuid: string):
        'AppSettingsPage' |
        'IntervalSettingsPage' |
        'TimerSettingsPage' |
        'StopwatchSettingsPage' {
        switch (uuid) {
            case StorageDefaultData.APP_ID: return 'AppSettingsPage';
            case StorageDefaultData.INTERVAL_ID: return 'IntervalSettingsPage';
            case StorageDefaultData.TIMER_ID: return 'TimerSettingsPage';
            case StorageDefaultData.STOPWATCH_ID: return 'StopwatchSettingsPage';
        }
    }

    static convertToStartupRoute(data: AppStorageData): string[] {
        return ['/' + AppUtils.getPageNameByID(data.current_uuid), data.current_uuid];
    }

    static getPageRouteByName(name: 'settings' | 'interval' | 'timer' | 'stopwatch'): string[] {
        if (name !== 'settings') {
            return ['/' + name, AppUtils.getIDByPageName(name)];
        } else {
            return ['/settings'];
        }
    }

    static getCombinedTheme(data: AppStorageData): string {
        const combined: string = 'theme-' + BaseTheme[data.base] + '-' + AccentTheme[data.accent];
        return combined.toLowerCase();
    }

    /**
     * Deep clones an object
     *
     * @param source
     */
    static clone<T>(source: T): { [k: string]: any } {
        const results: { [k: string]: any } = {};
        for (const P in source) {
            if (typeof source[P] === 'object') {
                results[P] = AppUtils.clone(source[P]);
            } else {
                results[P] = source[P];
            }
        }
        return results;
    }

    static totaltime(value?: UUIDData): string {
        if (value as IntervalStorageData) {
            const val = value as IntervalStorageData;
            const totaltimeInSeconds = (val.activerest.upper + val.activerest.lower) * val.intervals;
            return moment(totaltimeInSeconds * 1000).format('mm:ss.S');
        } else {
            return '00:00.0';
        }
    }
}
