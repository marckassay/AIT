import { Element } from '@wdio/sync';
import Gestures from '../helpers/Gestures';
import WebViewScreen, { CONTEXT_REF } from '../helpers/WebView';
import AppPage from '../pageobjects/app.page';

describe('Replicating sidemenuissue', () => {
  let appHome: Element;
  let leftMenu: Element;
  let rightMenu: Element;

  beforeEach(() => {
    WebViewScreen.waitForWebsiteLoaded();

    WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);

    appHome = AppPage.appHome;
    leftMenu = AppPage.leftMenu;
    rightMenu = AppPage.rightMenu;

    WebViewScreen.switchToContext(CONTEXT_REF.NATIVE);
  });

  it('left menu test', () => {
    Gestures.swipeRight();

    WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);

    expect(leftMenu.isDisplayed()).toBe(true);
    expect(rightMenu.isDisplayed()).toBe(false);
  });

  it('return home test', () => {
    Gestures.tapRight();

    WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);

    expect(appHome.isDisplayed()).toBe(true);
  });

  it('right menu test', () => {
    Gestures.swipeLeft();

    WebViewScreen.switchToContext(CONTEXT_REF.WEBVIEW);

    expect(leftMenu.isDisplayed()).toBe(false);
    expect(rightMenu.isDisplayed()).toBe(true);
  });
});
