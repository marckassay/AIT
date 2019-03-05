class AppPage {
    constructor() {

    }
    /**
     * define elements
     */
    get leftMenu() { return $('.menu-side-start'); }
    get rightMenu() { return $('.menu-side-end'); }
    get appHome() { return $('app-home.ion-page'); }
}

export default new AppPage();
