import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { RouteReuseStrategy } from '@angular/router/';
/*
export class AppRoutingStrategy implements RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        console.log('[shouldReuseRoute]', this.getPath(before), this.getPath(curr));
        if (this.getPath(before) && this.getPath(curr)) {
            console.log('[shouldReuseRoute] ==> true');
        } else {
            console.log('[shouldReuseRoute] ==> false');
        }
        return before.routeConfig === curr.routeConfig;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const path = this.getPath(route);
        const results = this.storedRouteHandles.get(path);
        console.log('[retrieve]', path);
        console.log('[retrieve] ==> ', results);
        return results as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        const results = this.storedRouteHandles.has(path);
        console.log('[shouldAttach]', path);
        console.log('[shouldAttach] ==> ', results);
        return results;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        const results = this.storedRouteHandles.has(path);
        console.log('[shouldDetach]', route);
        console.log('[shouldDetach] ==> ', results);
        return results;
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        const path = this.getPath(route);
        console.log('[store]', path, detachedTree);
        this.storedRouteHandles.set(path, detachedTree);
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        if (route.routeConfig !== null && route.routeConfig.path !== null) {
            return route.routeConfig.path;
        }
        return '';
    }
}
*/
export class AppRoutingStrategy implements RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void { }
    shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}
