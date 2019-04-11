/*
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
import { AppStorageData, AudioMockStorageData, IntervalStorageData, StopwatchStorageData, TimerStorageData } from './ait-storage.shapes';

export class StorageDefaultData {
  public static readonly APP_ID: string = '000000000001';
  public static readonly INTERVAL_ID: string = '000000000002';
  public static readonly TIMER_ID: string = '000000000003';
  public static readonly STOPWATCH_ID: string = '000000000004';
  public static readonly HOME_ID: string = '000000000005';

  public static readonly APP_DATA: AppStorageData = {
    uuid: StorageDefaultData.APP_ID,
    routable: true,
    current_uuid: StorageDefaultData.INTERVAL_ID,
    vibrate: true,
    sound: -10,
    brightness: -50,
    base: 0,
    accent: 0,
    orientation: 0
  };

  public static readonly INTERVAL_DATA: IntervalStorageData = {
    uuid: StorageDefaultData.INTERVAL_ID,
    routable: true,
    name: 'Program #1',
    activerest: { lower: 10, upper: 50 },
    intervals: 12,
    countdown: 10,
    factor: 10,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: false },
  };

  public static readonly TIMER_DATA: TimerStorageData = {
    uuid: StorageDefaultData.TIMER_ID,
    routable: true,
    name: 'Program #2',
    time: 900,
    countdown: 10,
    factor: 10,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };

  public static readonly STOPWATCH_DATA: StopwatchStorageData = {
    uuid: StorageDefaultData.STOPWATCH_ID,
    routable: true,
    name: 'Program #3',
    countdown: 10,
    factor: 10,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };
}

export class MockStorageData {
  // for development purposes only
  public static readonly AUDIO_MOCK_STORAGE_ID: string = '950fa447e45a';

  public static readonly AUDIO_MOCK_DATA: AudioMockStorageData = {
    uuid: MockStorageData.AUDIO_MOCK_STORAGE_ID,
    routable: false,
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
}
