import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { of, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';
import { UUIDData } from 'src/app/services/storage/ait-storage.shapes';

@Injectable({
    providedIn: 'root',
})
export class DisplayPageResolverService<T extends UUIDData> implements Resolve<Observable<BehaviorSubject<T>>> {
    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected storage: AITStorage
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BehaviorSubject<T>> | Observable<never> {
        const uuid = route.paramMap.get('id');

        // this block came from https://angular.io/guide/router#fetch-data-before-navigating
        return this.storage.getPageObservable<T>(uuid).pipe(
            take(1),
            mergeMap((value) => {
                if (value) {
                    return of(value);
                } else {
                    // TODO: add route for failed retrival
                    // this.router.navigate(['/crisis-center']);
                    return EMPTY;
                }
            })
        );
    }
}
