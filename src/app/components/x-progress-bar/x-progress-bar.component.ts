import { Component, Input, OnInit } from '@angular/core';
import { from, timer, BehaviorSubject, Observable } from 'rxjs';
import { delayWhen, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';


enum StyleVisibilityString {
    VISIBLE = 'visible',
    HIDDEN = 'hidden'
}

interface Emission {
    style: StyleVisibilityString;
    time?: number;
}

@Component({
    selector: 'x-progress-bar',
    templateUrl: './x-progress-bar.html'
})
export class XProgressBarComponent implements OnInit {
    public toShow$: Observable<StyleVisibilityString>;

    private subject: BehaviorSubject<Emission[]>;

    @Input()
    throttleTime: number;

    constructor() {
        this.throttleTime = 2000;
    }

    ngOnInit(): void {
        const emit = { style: StyleVisibilityString.VISIBLE, time: this.throttleTime };
        this.subject = new BehaviorSubject<Emission[]>([emit]);
        this.toShow$ = this.getObservable();
    }

    /**
     * Internally calls `show()` followed by `hide(duration)`.
     *
     * @param duration
     */
    momentary(duration: number = this.throttleTime): void {
        this.show();
        this.hide(duration);
    }

    /**
     * Sets progress bar to be hidden with a delay for the amount of duration assigned to `throttleTime`.
     */
    hide(throttleTime: number = this.throttleTime): void {
        const emit = { style: StyleVisibilityString.HIDDEN, time: throttleTime };
        this.subject.next([emit]);
    }

    /**
     * Immediately sets progress bar to be visible
     */
    show(): void {
        const emit = { style: StyleVisibilityString.VISIBLE };
        this.subject.next([emit]);
    }

    private getObservable(): Observable<StyleVisibilityString> {
        // when `subject.next()` is called, this expression will check to ensure that the emit
        // value is distinct. it will then map the outter index with emit value to be used to
        // switch Observable. if `vi.val` is `VISIBLE` then emit the value as-is, else delay it
        // from being emitted to prevent a glimpse of it animating.
        return this.subject.pipe(
            distinctUntilChanged((x, y) => {
                return x[0].style === y[0].style;
            }),
            switchMap((emitted) => {
                if (emitted[0].style === StyleVisibilityString.VISIBLE) {
                    return from(emitted);
                } else {
                    return from(emitted).pipe(
                        delayWhen((emission) => timer(emission.time))
                    );
                }
            }),
            pluck('style')
        );
    }
}
