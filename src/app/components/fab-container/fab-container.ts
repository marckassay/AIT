import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

export interface FabEmission {
  action: FabAction;
}

export enum FabAction {
  Main,
  Start,
  Pause,
  Program,
  Reset,
  Home
}

export enum FabState {
  Loading = 1,
  Ready = 1 << 2,
  Running = 1 << 3,
  Paused = 1 << 4,
  Completed = 1 << 5,
  ProgramVisible = 1 << 6,
  HomeVisible = 1 << 7
}

@Component({
  selector: 'fab-container',
  templateUrl: 'fab-container.html',
  styleUrls: ['./fab-container.scss']
})
export class FabContainerComponent {
  @Output()
  action = new EventEmitter<FabEmission>();

  public states = FabState;
  _viewState: FabState;
  get viewState(): FabState {
    return this._viewState;
  }
  set viewState(value: FabState) {
    this._viewState = value;
  }

  // this is for template can access FabAction enum members
  FA = FabAction;

  constructor(protected ngDectector: ChangeDetectorRef) { }

  actionRequest(action: FabAction): void {
    if (action === FabAction.Start) {
      // if action is Start, which exists in the Ready and Paused state, set the state to 'Running'
      this.setToRunningMode();
    }
    // else if action is Pause, which only exists in the Running state, set the state to 'Paused'
    // tslint:disable-next-line:one-line
    else if (action === FabAction.Pause) {
      this.setToPausedMode();
    }
    // else if action is Reset, which only exists in the Paused and Completed states, set to 'Ready'
    // tslint:disable-next-line:one-line
    else if (action === FabAction.Reset) {
      this.setToReadyMode();
    }

    if (action !== FabAction.Main) {
      this.action.emit({ action: action });
    }
  }

  /*
  methods to set viewState to modes and by preserving 'secondary' modes specifically; Home
  Program Button visibility.
  */
  setToLoadedMode(): void {
    this.viewState |= FabState.Loading;
    this.setToReadyMode();
  }

  private setToReadyMode(): void {
    if (this.viewState & FabState.Loading) {
      this.viewState &= ~FabState.Loading;
    } else if (this.viewState & FabState.Completed) {
      this.viewState &= ~FabState.Completed;
    } else if (this.viewState & FabState.Paused) {
      this.viewState &= ~FabState.Paused;
    }

    this.viewState |= FabState.Ready;
  }

  private setToRunningMode(): void {
    if (this.viewState & FabState.Ready) {
      this.viewState &= ~FabState.Ready;
    } else if (this.viewState & FabState.Paused) {
      this.viewState &= ~FabState.Paused;
    }

    this.viewState |= FabState.Running;
  }

  setToPausedMode(): void {
    if (this.viewState & FabState.Running) {
      this.viewState &= ~FabState.Running;

      this.viewState |= FabState.Paused;
    }
  }

  setToCompletedMode(): void {
    if (this.viewState & FabState.Running) {
      this.viewState &= ~FabState.Running;

      this.viewState |= FabState.Completed;
    }
  }

  setHomeButtonToVisible(): void {
    this.viewState |= FabState.HomeVisible;
    this.ngDectector.detectChanges();
  }

  setProgramButtonToVisible(): void {
    this.viewState |= FabState.ProgramVisible;
    this.ngDectector.detectChanges();
  }

  /*
  The following 'isX' properties are for the template to evaluate what buttons are to be shown.
  */
  public get isStartVisible(): boolean {
    return ((this.viewState & FabState.Ready) > 0 || (this.viewState & FabState.Paused) > 0);
  }

  public get isPauseVisible(): boolean {
    return (this.viewState & FabState.Running) > 0;
  }

  public get isResetVisible(): boolean {
    return ((this.viewState & FabState.Paused) > 0 || (this.viewState & FabState.Completed) > 0);
  }

  public get isProgramVisible(): boolean {
    return (this.viewState & FabState.ProgramVisible) > 0;
  }

  public get isHomeVisible(): boolean {
    return (this.viewState & FabState.HomeVisible) > 0;
  }
}
