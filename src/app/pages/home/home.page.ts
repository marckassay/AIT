import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AppUtils } from 'src/app/app.utils';
import { SideMenuService } from 'src/app/components/side-menu/side-menu.service';
import { StorageDefaultData } from 'src/app/services/storage/ait-storage.defaultdata';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterViewInit {
  constructor(
    private router: Router,
    protected menuSvc: SideMenuService,
    private menuCtrl: MenuController) { }

  ngAfterViewInit(): void {
    this.menuSvc.next({
      subject: 'start',
      uuid: StorageDefaultData.HOME_ID,
      response: 'loaded'
    });
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
