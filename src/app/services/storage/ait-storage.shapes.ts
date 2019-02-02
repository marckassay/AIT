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
   * Possible values is anything between these three members [-15, 0, 15]. A negative number indicates
   * the "remember volume" is disabled, while a positive number indicates that its enabled. A
   * value of 0 indicates that sound is disabled.
   *
   * Default value is -5; which means this sound is enabled but the "remember volume" is disabled.
   */
  sound: VolumeSet;

  /**
   * Default value is '-50'; which means the "remember brightness" feature is disabled.
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
  intervals: number;
  countdown: number;
  factor: 1 | 10;

  warnings: CountdownWarnings;
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
}

// tslint:disable-next-line:max-line-length
export type VolumeSet = -15 | -14 | -13 | -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type BrightnessSet = -100 | -90 | -80 | -70 | -60 | -50 | -40 | -30 | -20 | -10 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export enum AccentTheme {
  Monokai,
  RGBandY,
  CoolGrey
}

export enum BaseTheme {
  Dark,
  Light
}

export interface AudioModeShape {
  currentAudioMode: number;
}

export interface VolumeShape {
  ringVolume: number;
  ringMaxVolume: number;
  musicVolume: number;
  musicMaxVolume: number;
  notificationVolume: number;
  notificationMaxVolume: number;
  systemVolume: number;
  systemMaxVolume: number;
}

export type AudioMockStorageData = AudioModeShape & VolumeShape & UUIDData;
