const SELECTORS = {
    ANDROID_LISTVIEW: '//android.widget.ListView',
    IOS_PICKERWHEEL: '*//XCUIElementTypePickerWheel',
    DONE: `~header-Dropdown`,
};

class Picker {
    /**
     * Wait for the picker to be shown
     *
     * @param {boolean} isShown
     */
    static waitForIsShown(isShown = true): void {
        const selector = browser.isIOS ? SELECTORS.IOS_PICKERWHEEL : SELECTORS.ANDROID_LISTVIEW;
        ($(selector) as any).waitForExist(11000, !isShown);
    }

    /**
     * Select a value from the picker
     *
     * @param {string} value The value that needs to be selected
     */
    static selectValue(value: string): void {
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
     * @param {string} value
     *
     * @private
     */
    static _setAndroidValue(value: string): void {
        ($(`${SELECTORS.ANDROID_LISTVIEW}/*[@text='${value}']`) as any).click();
    }

    /**
     * Set the value for IOS
     *
     * @param {string} value
     *
     * @private
     */
    static _setIosValue(value: string): void {
        ($(SELECTORS.IOS_PICKERWHEEL) as any).addValue(value);
        ($(SELECTORS.DONE) as any).click();
    }
}

export default Picker;
