/**
    AIT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import moment from 'moment';
import { environment } from 'src/environments/environment';

import { MockStorageData, StorageDefaultData } from './services/storage/ait-storage.defaultdata';
// tslint:disable-next-line:max-line-length
import { AccentTheme, AppStorageData, BaseTheme, IntervalStorageData, TimerStorageData, UUIDData } from './services/storage/ait-storage.shapes';

export class AppUtils {

    /**
     * Returns the default data for ID matching to `uuid`. Default value is declared in this class as private members.
     */
    static getDataByID(uuid: string): UUIDData {
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
        if ('activerest' in value) {
            const val = value as IntervalStorageData;
            const totaltimeInSeconds = (val.activerest.upper + val.activerest.lower) * val.intervals;
            return moment(totaltimeInSeconds * 1000).format('mm:ss.S');
        } else if ('time' in value) {
            const val = value as TimerStorageData;
            return moment(val.time * 1000).format('mm:ss.S');
        } else {
            return '00:00.0';
        }
    }

    /**
     * Convenient to be used in between `awaits` when a delay is needed after the preceding `await`
     * is settled.
     *
     * @param time duration of delay
     */
    static delayPromise(time: number): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), time);
        });
    }
}

export namespace AppUtils {
    export enum DeviceError {
        UNKNOWN = 'UNKNOWN',
        LOCAL_STORAGE_FAILED = 'LOCAL_STORAGE_FAILED',
        DO_NOT_DISTURB = 'DO_NOT_DISTURB'
    }
}

// TODO: moved to a file that will get replaced by Angular's fileReplacements object
/**
 * A simple assertion test that verifies whether `value` is truthy.
 * If it is not, an `AssertionError` is thrown.
 * If provided, the error `message` is formatted using `util.format()` and used as the error message.
 */
export function assert(value: any, message?: string, ...optionalParams: any[]): void {
    if (environment.production === false) {
        console.assert(value, message, ...optionalParams);
    }
}
/**
 * When `stdout` is a TTY, calling `console.clear()` will attempt to clear the TTY.
 * When `stdout` is not a TTY, this method does nothing.
 */
export function clear(): void {
    if (environment.production === false) {
        console.clear();
    }
}
/**
 * Maintains an internal counter specific to `label` and outputs to `stdout` the number of
 * times `console.count()` has been called with the given `label`.
 */
export function count(label?: string): void {
    if (environment.production === false) {
        console.count(label);
    }
}
/**
 * This method calls {@link console.log()} passing it the arguments received. Please note that
 * this method does not produce any XML formatting
 */
export function dirxml(...data: any[]): void {
    if (environment.production === false) {
        console.dirxml(data);
    }
}
/**
 * Prints to `stderr` with newline.
 */
export function error(message?: any, ...optionalParams: any[]): void {
    if (environment.production === false) {
        console.error(message, optionalParams);
    }
}
/**
 * The `console.groupCollapsed()` function is an alias for {@link console.group()}.
 */
export function groupCollapsed(): void {
    if (environment.production === false) {
        console.groupCollapsed();
    }
}
/**
 * Decreases indentation of subsequent lines by two spaces.
 */
export function groupEnd(): void {
    if (environment.production === false) {
        console.groupEnd();
    }
}
/**
 * Prints to `stdout` with newline.
 */
export function log(message?: any, ...optionalParams: any[]): void {
    if (environment.production === false) {
        console.log(message, optionalParams);
    }
}
/**
 * This method does not display anything unless used in the inspector.
 * Prints to `stdout` the array `array` formatted as a table.
 */
export function table(tabularData: any, properties?: string[]): void {
    if (environment.production === false) {
        console.table(tabularData, properties);
    }
}
/**
 * The {@link console.warn()} function is an alias for {@link console.error()}.
 */
export function warn(message?: any, ...optionalParams: any[]): void {
    if (environment.production === false) {
        console.warn(message, optionalParams);
    }
}
/**
 * This method does not display anything unless used in the inspector.
 * Starts a JavaScript CPU profile with an optional label.
 */
export function profile(label?: string): void {
    if (environment.production === false) {
        console.profile(label);
    }
}
/**
 * This method does not display anything unless used in the inspector.
 *  Stops the current JavaScript CPU profiling session if one has been started and prints the report
 * to the Profiles panel of the inspector.
 */
export function profileEnd(label?: string): void {
    if (environment.production === false) {
        console.profileEnd(label);
    }
}
/**
 * This method does not display anything unless used in the inspector.
 *  Adds an event with the label `label` to the Timeline panel of the inspector.
 */
export function timeStamp(label?: string): void {
    if (environment.production === false) {
        console.timeStamp(label);
    }
}

