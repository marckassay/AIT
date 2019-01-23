import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';

import { AITBaseSettingsPage } from '../pages/ait-basesettings.page';


@Injectable({
    providedIn: 'root'
})
export class RightMenuSubject extends Subject<typeof AITBaseSettingsPage> {
    menu;

    constructor(private menuCtrl: MenuController,
        private componentFactoryResolver: ComponentFactoryResolver) {
        super();

        this.subscribe((page) => {
            if (page) {

                this.createComponentForSideMenu('end', page);
            }
            /*             if (!this.leftMenuInnerHTML) {
                            this.createComponentForSideMenu('start', HomePage);
                        } */
        });
    }


    // TODO: would like to know preferred way to type this parameter. tried
    // 'typeof AITBaseSettingsPage | typeof HomePage'
    private createComponentForSideMenu(menuId: 'start' | 'end', page: any) {
        const htmlElement: ViewContainerRef = this.menu;

        /*       this.menuCtrl.get('end').then((value) => {
                  console.log('INNER', value.innerHTML.toString());
                  htmlElement = value.innerHTML;
              }); */

        const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory<any>(page);

        /*if (menuId === 'end') {
            htmlElement = this.rightMenuInnerHTML;
        }  else {
            htmlElement = this.leftMenuInnerHTML;
        } */
        // this.menuCtrl.enable(true, menuId);

        htmlElement.clear();
        htmlElement.createComponent(resolvedComponent);
    }
}
