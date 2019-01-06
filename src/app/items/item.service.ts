import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Item } from './item';
import { ITEMS } from './mock-items';

@Injectable({
    providedIn: 'root',
})
export class ItemService {

    constructor() { }

    getItems(): Observable<Item[]> {
        // TODO: send the message _after_ fetching the heroes
        return of(ITEMS);
    }

    getItem(id: number | string) {
        return this.getItems().pipe(
            // (+) before `id` turns the string into a number
            map((items: Item[]) => items.find(item => item.id === +id))
        );
    }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
