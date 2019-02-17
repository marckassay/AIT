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
export interface UUIDData {

  /**
   * The storage key to data that implements `UUIDData` and as identifier for routes.
   */
  readonly uuid: string;

  /**
   * If this data can be used to a routable component, then its set to true. If data is not routable
   * such as mock storage to emulate device's storage, then its set to false.
   */
  readonly routable: boolean;
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

  orientation: OrientationSetting;
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
  factor: 1 | 10;
  countdown: number;
  warnings: CountdownWarnings;
}

export interface TimerStorageData extends StopwatchStorageData {
  time: number;
  factor: 1 | 10;
  warnings: CountdownWarnings;
}

// tslint:disable-next-line:max-line-length
export type VolumeSet = -15 | -14 | -13 | -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type BrightnessSet = -100 | -90 | -80 | -70 | -60 | -50 | -40 | -30 | -20 | -10 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

export enum BaseTheme {
  Dark,
  Light
}

export enum AccentTheme {
  Monokai,
  RGBandY,
  CoolGrey
}

export enum OrientationSetting {
  Current,
  Portrait,
  Landscape
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

/**
 * When app.module uses `AudioManagementMock` during web or as a Progressive Web App development, it
 * stores its data to IndexedDB. But it needs to have a JSON key to be stored, hence `UUIDData` being
 * intersected with its original shapes.
 */
export type AudioMockStorageData = AudioModeShape & VolumeShape & UUIDData;
