import Gestures from './Gestures';

export const CONTEXT_REF = {
    NATIVE: 'native',
    WEBVIEW: 'webview',
};
const DOCUMENT_READY_STATE = {
    COMPLETE: 'complete',
    INTERACTIVE: 'interactive',
    LOADING: 'loading',
};

class WebView {
    constructor() {

    }
    /**
     * Wait for the webview context to be loaded
     *
     * By default you have `NATIVE_APP` as the current context. If a webview is loaded it will be
     * added to the current contexts and will looks something like this
     * `["NATIVE_APP","WEBVIEW_28158.2"]`
     * The number behind `WEBVIEW` can be any string
     */
    waitForWebViewContextLoaded() {
        browser.waitUntil(
            () => {
                let result: boolean;
                const currentContexts = this.getCurrentContexts();

                if (currentContexts.length > 1) {
                    result = !!currentContexts.find(context => context.toLowerCase().includes(CONTEXT_REF.WEBVIEW));
                }

                return result;
            },
            10000,
            'Webview context not loaded',
            100
        );
    }

    /**
     * Switch to native or webview context
     *
     * @param {string} context should be native of webview
     */
    switchToContext(context) {
        browser.switchContext(this.getCurrentContexts()[context === CONTEXT_REF.WEBVIEW ? 1 : 0]);
    }

    /**
     * Returns an object with the list of all available contexts
     *
     * @return {object} An object containing the list of all available contexts
     */
    getCurrentContexts() {
        return browser.getContexts();
    }

    /**
     * Wait for the document to be full loaded
     */
    waitForDocumentFullyLoaded() {
        browser.waitUntil(
            () => browser.execute(() => document.readyState) === DOCUMENT_READY_STATE.COMPLETE,
            15000,
            'Website not loaded',
            100
        );
    }

    /**
     * Wait for the website in the webview to be loaded
     */
    waitForWebsiteLoaded() {
        this.waitForWebViewContextLoaded();
        this.switchToContext(CONTEXT_REF.WEBVIEW);
        this.waitForDocumentFullyLoaded();
        this.switchToContext(CONTEXT_REF.NATIVE);
    }

    /*     swipeLeftUntilWebsiteLoaded() {
            browser.waitUntil(() => browser.execute(() => {
                if (document && document.readyState === 'loading') {
                    Gestures.swipeLeft();
                    console.log('swiping!');
                }
                return document && document.readyState === 'complete';
            }),
                15000,
                'Website not loaded',
                100
            );
        } */
}

export default new WebView();
