import { Component, OnInit } from '@angular/core';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { delay, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

enum StyleVisibilityString {
    VISIBLE = 'visible',
    HIDDEN = 'hidden'
}

@Component({
    selector: 'x-progress-bar',
    templateUrl: './x-progress-bar.html',
})
export class XProgressBarComponent implements OnInit {
    protected toShow$: Observable<StyleVisibilityString>;

    private subject: BehaviorSubject<StyleVisibilityString[]>;

    private throttleTime: number;

    constructor() {
        this.throttleTime = 2000;
    }

    ngOnInit(): void {
        this.subject = new BehaviorSubject<StyleVisibilityString[]>([StyleVisibilityString.VISIBLE]);
        this.toShow$ = this.getObservable();
    }

    hide(): void {
        this.subject.next([StyleVisibilityString.HIDDEN]);
    }

    show(): void {
        this.subject.next([StyleVisibilityString.VISIBLE]);
    }

    private getObservable(): Observable<StyleVisibilityString> {
        // when `subject.next()` is called, this expression will check to ensure that the emit
        // value is distinct. it will then map the outter index with emit value to be used to
        // switch Observable. if `vi.val` is `VISIBLE` then emit the value as-is, else delay it
        // from being emitted to prevent a glimpse of it animating.
        return this.subject.pipe(
            distinctUntilChanged((x, y) => x[0] === y[0]),
            map((val, ind) => {
                return { val, ind };
            }),
            switchMap((vi) => {
                return (vi.val[0] === StyleVisibilityString.VISIBLE) ? vi.val : from(vi.val).pipe(delay(this.throttleTime));
            })
        );
    }
}
