import { Element } from '@wdio/sync';
import Page from './page';

class AppPage extends Page {
    constructor() {
        super();
    }
    /**
     * define elements
     */
    get leftMenu(): Element { return $('.menu-side-start'); }
    get rightMenu(): Element { return $('.menu-side-end'); }
    get appHome(): Element { return $('app-home.ion-page'); }
}

export default new AppPage();
