import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListPage } from './item-list/item-list.page';
import { ItemDetailComponent } from './item-details/item-detail.component';

const itemsRoutes: Routes = [
    // if item-ItemDetailComponent is call navigate() with an interger only, uncomment the following:
    /*  { path: 'items/:id', redirectTo: '/superitems/:id' },
        { path: 'superitems/:id', component: ItemListPage }, */
    { path: 'items', redirectTo: '/superitems' },
    { path: 'item/:id', redirectTo: '/superitem/:id' },
    { path: 'superitems', component: ItemListPage },
    { path: 'superitem/:id', component: ItemDetailComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(itemsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ItemsRoutingModule { }

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
