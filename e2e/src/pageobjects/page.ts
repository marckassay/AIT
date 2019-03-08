export default class Page {
    open(path: string): void {
        browser.url(path);
    }
}
