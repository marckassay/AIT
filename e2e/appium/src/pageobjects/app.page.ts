class AppPage {
    constructor() {

    }
    /**
     * define elements
     */
    get leftMenu(): WebdriverIO.Element { return $('.menu-side-start') as any; }
    get rightMenu(): WebdriverIO.Element { return $('.menu-side-end') as any; }
    get appHome(): WebdriverIO.Element { return $('page-interval-display.ion-page') as any; }
}

export default new AppPage();
