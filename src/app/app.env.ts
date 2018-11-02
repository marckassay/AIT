export interface AppEnvShape {
  readonly platform: 'android';
  readonly target: 'browser' | 'device' | 'emulator';
  readonly useMock: boolean;
}
export declare let APP_ENV: AppEnvShape;
