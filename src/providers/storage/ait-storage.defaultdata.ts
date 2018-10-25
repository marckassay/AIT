import { IntervalStorageData, TimerStorageData, AppStorageData, StopwatchStorageData, UUIDData } from './ait-storage.interfaces';

export class StorageDefaultData {
  public static readonly APP_ID: string = '00000000-0000-0000-0000-000000000001';
  public static readonly INTERVAL_ID: string = '00000000-0000-0000-0000-000000000002';
  public static readonly TIMER_ID: string = '00000000-0000-0000-0000-000000000003';
  public static readonly STOPWATCH_ID: string = '00000000-0000-0000-0000-000000000004';

  /**
   * Returns the default data for ID matching to `uuid`. Default value is declared in this class as private members.
   */
  public static getByID(uuid: string): UUIDData {
    switch (uuid) {
      case this.APP_ID: return StorageDefaultData.APP_DATA;
      case this.INTERVAL_ID: return StorageDefaultData.INTERVAL_DATA;
      case this.TIMER_ID: return StorageDefaultData.TIMER_DATA;
      case this.STOPWATCH_ID: return StorageDefaultData.STOPWATCH_DATA;
    }
  }

  private static readonly APP_DATA: AppStorageData = {
    uuid: StorageDefaultData.APP_ID,
    current_uuid: StorageDefaultData.INTERVAL_ID,
    vibrate: true,
    sound: 10,
    brightness: -50,
    base: 0,
    accent: 0
  };

  private static readonly INTERVAL_DATA: IntervalStorageData = {
    uuid: StorageDefaultData.INTERVAL_ID,
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

  private static readonly TIMER_DATA: TimerStorageData = {
    uuid: StorageDefaultData.TIMER_ID,
    name: 'Program #2',
    countdown: 10,
    countdownmaxlimit: 60,
    time: 900,
    hasLastSettingChangedTime: false,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };

  private static readonly STOPWATCH_DATA: StopwatchStorageData = {
    uuid: StorageDefaultData.STOPWATCH_ID,
    name: 'Program #3',
    countdown: 10,
    countdownmaxlimit: 60,
    hasLastSettingChangedTime: false,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };
}
