import { AppStorageData, IntervalStorageData, StopwatchStorageData, TimerStorageData } from './ait-storage.interfaces';

export class StorageDefaultData {
  public static readonly APP_ID: string = '00000000-0000-0000-0000-000000000001';
  public static readonly INTERVAL_ID: string = '00000000-0000-0000-0000-000000000002';
  public static readonly TIMER_ID: string = '00000000-0000-0000-0000-000000000003';
  public static readonly STOPWATCH_ID: string = '00000000-0000-0000-0000-000000000004';
  public static readonly HOME_ID: string = '00000000-0000-0000-0000-000000000005';


  public static readonly APP_DATA: AppStorageData = {
    uuid: StorageDefaultData.APP_ID,
    current_uuid: StorageDefaultData.INTERVAL_ID,
    vibrate: true,
    sound: 10,
    brightness: -50,
    base: 0,
    accent: 0
  };

  public static readonly INTERVAL_DATA: IntervalStorageData = {
    uuid: StorageDefaultData.INTERVAL_ID,
    name: 'Program #1',
    activerest: { lower: 10, upper: 50 },
    intervals: 12,
    countdown: 10,
    factor: 10,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: false },
  };

  public static readonly TIMER_DATA: TimerStorageData = {
    uuid: StorageDefaultData.TIMER_ID,
    name: 'Program #2',
    countdown: 10,
    countdownmaxlimit: 60,
    time: 900,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };

  public static readonly STOPWATCH_DATA: StopwatchStorageData = {
    uuid: StorageDefaultData.STOPWATCH_ID,
    name: 'Program #3',
    countdown: 10,
    countdownmaxlimit: 60,
    warnings: { fivesecond: false, tensecond: true, fifteensecond: true }
  };
}
