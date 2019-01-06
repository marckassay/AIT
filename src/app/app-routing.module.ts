import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListPage } from './items/item-list/item-list.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    component: ItemListPage,
    loadChildren: './items/items.module#ItemsModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: false, // <-- debugging purposes only
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
