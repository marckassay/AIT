import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AppUtils } from 'src/app/app.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuCtrl: MenuController) { }

  ngOnInit(): void {
  }

  routeTo(name: 'settings' | 'interval' | 'timer' | 'stopwatch'): void {
    const request = AppUtils.getPageRouteByName(name);

    this.menuCtrl.close('start').then(() => {
      if (this.router.url !== request.join('/')) {
        this.router.navigate(request);
      }
    });
  }
}
