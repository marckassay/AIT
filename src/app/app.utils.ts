import { StorageDefaultData } from './services/storage/ait-storage.defaultdata';
import { AppStorageData, UUIDData } from './services/storage/ait-storage.interfaces';

export class AppUtils {
    /**
     * Returns the default data for ID matching to `uuid`. Default value is declared in this class as private members.
     */
    public static getPageDataByID(uuid: string): UUIDData {
        switch (uuid) {
            case StorageDefaultData.APP_ID: return StorageDefaultData.APP_DATA;
            case StorageDefaultData.INTERVAL_ID: return StorageDefaultData.INTERVAL_DATA;
            case StorageDefaultData.TIMER_ID: return StorageDefaultData.TIMER_DATA;
            case StorageDefaultData.STOPWATCH_ID: return StorageDefaultData.STOPWATCH_DATA;
        }
    }

    public static getPageNameByID(uuid: string): 'settings' | 'interval' | 'timer' | 'stopwatch' {
        switch (uuid) {
            case StorageDefaultData.APP_ID: return 'settings';
            case StorageDefaultData.INTERVAL_ID: return 'interval';
            case StorageDefaultData.TIMER_ID: return 'timer';
            case StorageDefaultData.STOPWATCH_ID: return 'stopwatch';
        }
    }

    public static getPageClassByID(uuid: string):
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

    public static convertToStartupRoute(data: AppStorageData): string[] {
        return ['/' + AppUtils.getPageNameByID(data.current_uuid), data.current_uuid];
    }
}
