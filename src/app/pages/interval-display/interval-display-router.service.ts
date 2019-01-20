import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { from } from 'rxjs';
import { IntervalStorageData } from 'src/app/providers/storage/ait-storage.interfaces';
import { AITStorage } from 'src/app/providers/storage/ait-storage.service';

@Injectable({
    providedIn: 'root',
})
export class IntervalDisplayResolverService implements Resolve<IntervalStorageData> {
    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected storage: AITStorage
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const uuid = route.paramMap.get('id');
        const data = this.storage.getPagePromise<IntervalStorageData>(uuid);
        // data.then(val => console.log('IntervalDisplayResolverService loading', val.name));
        return from(data);
    }
}
