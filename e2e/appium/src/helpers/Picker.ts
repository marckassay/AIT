const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '*//XCUIElementTypePickerWheel',
    DONE: `~header-Dropdown`,
};

class Picker {
    /**
     * Wait for the picker to be shown
     *
     * @param isShown waits for picker or list to be shown if true
     */
    static waitForIsShown(isShown = true) {
        const selector = browser.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        ($(selector) as any).waitForExist(11000, !isShown);
    }

    /**
     * Select a value from the picker
     *
     * @param value The value that needs to be selected
     */
    static selectValue(value: any) {
        this.waitForIsShown(true);
        if (browser.isIOS) {
            this._setIosValue(value);
        } else {
            this._setAndroidValue(value);
        }
        this.waitForIsShown(false);
    }

    /**
     * Set the value for Android
     *
     * @param value click on item with value
     */
    static _setAndroidValue(value: string) {
        ($(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`) as any).click();
    }

    /**
     * Set the value for IOS
     *
     * @param value click on item with value
     */
    static _setIosValue(value: string) {
        ($(SELECTORS.IOS_PICKERWHEEL) as any).addValue(value);
        ($(SELECTORS.DONE) as any).click();
    }
}

export default Picker;
