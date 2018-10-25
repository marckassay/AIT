export interface UUIDData {
  readonly uuid: string;
}

export interface AppStorageData extends UUIDData {
  /**
   * When the user enters Interval, Timer or Stopwatch page, this field is set with their uuid. This
   * is used during startup to resume where the user has left-off.
   */
  current_uuid: string;

  /**
   * For vibrating purposes only.
   */
  vibrate: boolean;

  /**
   * Possible values is anything between these three members [-1, 0, 1]. A negative number indicates
   * these "remember volume" is disabled, while a positive number indicates that its enabled. A
   * value of 0 indicates that sound is disabled.
   */
  sound: number;

  /**
   *  Default value is '-50'; which means by default this feature is disabled.
   */
  brightness: BrightnessSet;

  /**
   * Dark or Light theme
   */
  base: number;

  /**
   * Cool Grey, RGB and Y, monokai
   */
  accent: number;
}

export interface CountdownWarnings {
  fivesecond: boolean;
  tensecond: boolean;
  fifteensecond: boolean;
}

export interface Limits {
  lower: number;
  upper: number;
}

export interface IntervalStorageData extends UUIDData {
  name: string;
  activerest: Limits;
  activemaxlimit: number;

  intervals: number;
  intervalmaxlimit: number;

  countdown: number;
  countdownmaxlimit: number;

  warnings: CountdownWarnings;

  // this field needs to be maintained by object that reads it.
  hasLastSettingChangedTime: boolean;
}

export interface StopwatchStorageData extends UUIDData {
  name: string;

  countdown: number;
  countdownmaxlimit: number;

  warnings: CountdownWarnings;

  // this field needs to be maintained by object that reads it.
  hasLastSettingChangedTime: boolean;
}

export interface TimerStorageData extends StopwatchStorageData {
  time: number;
  warnings: CountdownWarnings;

  // this field needs to be maintained by object that reads it.
  hasLastSettingChangedTime: boolean;
}

export type BrightnessSet = -100 | -90 | -80 | -70 | -60 | -50 | -40 | -30 | -20 | -10 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
