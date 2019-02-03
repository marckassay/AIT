import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AppUtils } from 'src/app/app.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private router: Router,
    private menuCtrl: MenuController) { }

  ngOnInit(): void {
  }

  routeTo(name: 'settings' | 'interval' | 'timer' | 'stopwatch'): void {
    this.menuCtrl.close('start')
      .then((value) => {
        const request = AppUtils.getPageRouteByName(name);
        if ((value === true) && (this.router.url !== request.join('/'))) {
          this.router.navigate(request);
        }
      });
  }
}
