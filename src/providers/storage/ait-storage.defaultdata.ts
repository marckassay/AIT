import { IntervalStorageData, TimerStorageData, UUIDData, AppStorageData, StopwatchStorageData } from './ait-storage.interfaces';

export class StorageDefaultData {
  public static readonly APP_ID: string = '00000000-0000-0000-0000-000000000001';
  public static readonly INITIAL_INTERVAL_ID: string = '00000000-0000-0000-0000-000000000002';
  public static readonly INITIAL_TIMER_ID: string = '00000000-0000-0000-0000-000000000003';
  public static readonly INITIAL_STOPWATCH_ID: string = '00000000-0000-0000-0000-000000000004';

  public static readonly APP_DATA: AppStorageData = {
    uuid: StorageDefaultData.APP_ID,
    current_uuid: StorageDefaultData.INITIAL_INTERVAL_ID,
    vibrate: true,
    sound: 10,
    brightness: -50,
    base: 0,
    accent: 0
  };

  public static readonly INTERVAL_DATA: IntervalStorageData = {
    uuid: StorageDefaultData.INITIAL_INTERVAL_ID,
    name: 'Program #1',
    activerest: { lower: 10, upper: 50 },
    activemaxlimit: 90,
    intervals: 12,
    intervalmaxlimit: 20,
    countdown: 10,
    countdownmaxlimit: 60,
    hasLastSettingChangedTime: false,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: false },
  };

  public static readonly TIMER_DATA: TimerStorageData = {
    uuid: StorageDefaultData.INITIAL_TIMER_ID,
    name: 'Program #2',
    countdown: 10,
    countdownmaxlimit: 60,
    time: 900,
    hasLastSettingChangedTime: false,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };

  public static readonly STOPWATCH_DATA: StopwatchStorageData = {
    uuid: StorageDefaultData.INITIAL_STOPWATCH_ID,
    name: 'Program #3',
    countdown: 10,
    countdownmaxlimit: 60,
    hasLastSettingChangedTime: false,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };
}
