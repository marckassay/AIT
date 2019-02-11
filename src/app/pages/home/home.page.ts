/**
    AiT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
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
    protected menuSvc: SideMenuService) { }

  ngAfterViewInit(): void {
    this.menuSvc.send({
      subject: 'start',
      uuid: StorageDefaultData.HOME_ID,
      response: true
    });
  }

  routeTo(name: 'settings' | 'interval' | 'timer' | 'stopwatch'): void {
    // TODO: when visitng a display-page that wasn't loaded on startup, this close before the it
    // is resolved by Angular.
    this.menuSvc.closeLeftMenu()
      .then((value) => {
        const request = AppUtils.getPageRouteByName(name);
        if ((value === true) && (this.router.url !== request.join('/'))) {
          this.router.navigate(request);
        }
      });
  }
}
