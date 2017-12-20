export interface AITTimerPage {
  aitLoadView(): void;
  aitLoadTimer(): void;
  aitLoadData(): void;

  aitBuildTimer(): void;
  aitSubscribeTimer(): void;

  aitResetView(): void;
  aitResetTimer(): void;

  aitSetViewRunningMode(value: boolean): void;
}
