export interface UUIDData {
  uuid: string;
  current_uuid: string;
}

export type BrightnessSet = -100 | -90 | -80 | -70 | -60 | -50 | -40 | -30 | -20 | -10 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export interface AppStorageData extends UUIDData {
  vibrate: boolean;
  sound: BrightnessSet;
  // default value is '-0.70'; which means by default this feature is disabled
  brightness: BrightnessSet;
  lighttheme: boolean;
  base: number;
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
}

export interface TimerStorageData extends StopwatchStorageData {
  time: number;
  warnings: CountdownWarnings;

  // this field needs to be maintained by object that reads it.
  hasLastSettingChangedTime: boolean;
}
