import { Component, OnInit } from '@angular/core';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { delay, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

/* enum StyleDisplayString {
    BLOCK = 'block',
    NONE = 'none'
} */

enum StyleVisibilityString {
    VISIBLE = 'visible',
    HIDDEN = 'hidden'
}

@Component({
    selector: 'x-progress-bar',
    templateUrl: './x-progress-bar.html',
})
export class XProgressBarComponent implements OnInit {
    toShow$: Observable<StyleVisibilityString>;

    private subject: BehaviorSubject<StyleVisibilityString[]>;

    private throttleTime: number;

    constructor() {
        this.throttleTime = 3000;
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
