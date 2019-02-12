/**
    AiT - Another Interval Timer
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
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { of, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';
import { UUIDData } from 'src/app/services/storage/ait-storage.shapes';

@Injectable({
    providedIn: 'root',
})
/**
 * @source https://angular.io/guide/router#resolve-pre-fetching-component-data
 */
export class DisplayPageResolverService<T extends UUIDData> implements Resolve<Observable<BehaviorSubject<T>>> {
    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected storage: AITStorage
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BehaviorSubject<T>> | Observable<never> {
        const uuid = route.paramMap.get('id');

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
