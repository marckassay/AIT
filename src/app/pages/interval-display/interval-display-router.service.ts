import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { from } from 'rxjs';
import { UUIDData } from 'src/app/services/storage/ait-storage.interfaces';
import { AITStorage } from 'src/app/services/storage/ait-storage.service';

@Injectable({
    providedIn: 'root',
})
export class IntervalDisplayResolverService implements Resolve<UUIDData> {
    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected storage: AITStorage
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const uuid = route.paramMap.get('id');
        const data = this.storage.getPagePromise<UUIDData>(uuid);
        return from(data);
    }
}
