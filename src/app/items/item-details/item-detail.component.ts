import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { ItemService } from '../item.service';
import { Item } from '../item';

@Component({
    selector: 'app-item-detail',
    templateUrl: 'item-detail.component.html',
    styleUrls: ['item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
    item$: Observable<Item>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: ItemService
    ) { }

    ngOnInit() {
        this.item$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.service.getItem(params.get('id')))
        );
    }

    gotoList(item) {
        this.router.navigate(['/superitems', { id: item.id }]);

        // foo is demonstrating that any arbitrary data can be add to query object.
        // this.router.navigate(['/superitems', { id: item.id, foo: 'foo' }]);

        // this.router.navigate(['/superitems', item.id]);
    }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
