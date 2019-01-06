import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemService } from '../item.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Item } from '../item';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: 'item-list.page.html',
  styleUrls: ['item-list.page.scss']
})
export class ItemListPage implements OnInit {
  items$: Observable<Item[]>;
  selectedId: number;

  constructor(
    private service: ItemService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.items$ = this.route.paramMap.pipe(
      switchMap((params: Params) => {
        this.selectedId = (params.get('id') !== null) ? +params.get('id') : 1;
        return this.service.getItems();
      })
    );
  }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
