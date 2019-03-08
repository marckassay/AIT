import { Element } from '@wdio/sync';

interface LocationCords {
    x: number;
    y: number;
}

interface Dimensions {
    width: number;
    height: number;
}

let SCREEN_SIZE: Dimensions;

/**
 * The values in the below object are percentages of the screen
 */
const SWIPE_DIRECTION = {
    down: {
        start: { x: 50, y: 15 },
        end: { x: 50, y: 85 },
    },
    left: {
        start: { x: 95, y: 50 },
        end: { x: 5, y: 50 },
    },
    right: {
        start: { x: 5, y: 50 },
        end: { x: 95, y: 50 },
    },
    up: {
        start: { x: 50, y: 85 },
        end: { x: 50, y: 15 },
    },
};

const TAP_LOCATION = {
    left: { x: 5, y: 50 },
    right: { x: 95, y: 50 }
};

class Gestures {
    /**
     * Check if an element is visible and if not scroll down a portion of the screen to
     * check if it visible after a x amount of scrolls
     *
     * @param element
     * @param maxScrolls
     * @param amount
     */
    static checkIfDisplayedWithScrollDown(element: Element, maxScrolls: number, amount = 0): void {
        if ((!element.isExisting() || !element.isDisplayed()) && amount <= maxScrolls) {
            this.swipeUp(0.85);
            this.checkIfDisplayedWithScrollDown(element, maxScrolls, amount + 1);
        } else if (amount > maxScrolls) {
            throw new Error(`The element '${element}' could not be found or is not visible.`);
        }
    }

    /**
     * Swipe down based on a percentage
     *
     * @param percentage from 0 - 1
     */
    static swipeDown(percentage = 1): void {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.down.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.down.end, percentage),
        );
    }

    /**
     * Swipe Up based on a percentage
     *
     * @param percentage from 0 - 1
     */
    static swipeUp(percentage = 1): void {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.up.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.up.end, percentage),
        );
    }

    /**
     * Swipe left based on a percentage
     *
     * @param percentage from 0 - 1
     */
    static swipeLeft(percentage = 1): void {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.left.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.left.end, percentage),
        );
    }

    /**
     * Swipe right based on a percentage
     *
     * @param percentage from 0 - 1
     */
    static swipeRight(percentage = 1): void {
        this.swipeOnPercentage(
            this.calculateXY(SWIPE_DIRECTION.right.start, percentage),
            this.calculateXY(SWIPE_DIRECTION.right.end, percentage),
        );
    }

    /**
     * Single tap on right side of display
     */
    static tapLeft(): void {
        this.tapOnPercentage(TAP_LOCATION.left);
    }

    /**
     * Single tap on right side of display
     */
    static tapRight(): void {
        this.tapOnPercentage(TAP_LOCATION.right);
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are
     * percentages of the screen.
     *
     * @param from { x: 50, y: 50 }
     * @param to { x: 25, y: 25 }
     *
     * @example
     * <pre>
     *   // This is a swipe to the left
     *   const from = { x: 50, y:50 }
     *   const to = { x: 25, y:50 }
     * </pre>
     */
    static swipeOnPercentage(from: LocationCords, to: LocationCords): void {
        SCREEN_SIZE = SCREEN_SIZE || browser.getWindowRect() as Dimensions;
        const pressOptions = this.getDeviceScreenCoordinates(SCREEN_SIZE, from);
        const moveToScreenCoordinates = this.getDeviceScreenCoordinates(SCREEN_SIZE, to);
        this.swipe(
            pressOptions,
            moveToScreenCoordinates,
        );
    }

    static tapOnPercentage(location: LocationCords): void {
        SCREEN_SIZE = SCREEN_SIZE || browser.getWindowRect() as Dimensions;
        const tapCoordinates = this.getDeviceScreenCoordinates(SCREEN_SIZE, location);
        this.tap(tapCoordinates);
    }

    /**
     * Swipe from coordinates (from) to the new coordinates (to). The given coordinates are in pixels.
     *
     * @param from { x: 50, y: 50 }
     * @param to { x: 25, y: 25 }
     *
     * @example
     * <pre>
     *   // This is a swipe to the left
     *   const from = { x: 50, y:50 }
     *   const to = { x: 25, y:50 }
     * </pre>
     */
    static swipe(from: LocationCords, to: LocationCords): void {
        browser.touchPerform([{
            action: 'press',
            options: from,
        }, {
            action: 'wait',
            options: { ms: 1000 },
        }, {
            action: 'moveTo',
            options: to,
        }, {
            action: 'release',
        }]);
        browser.pause(1000);
    }

    static tap(location: LocationCords): void {
        browser.touchPerform([{
            action: 'tap',
            options: location
        }]);
        browser.pause(1000);
    }

    /**
     * Get the screen coordinates based on a device his screensize
     *
     * @param screenSize the size of the screen
     * @param coordinates like { x: 50, y: 50 }
     *
     * @return {{x: number, y: number}}
     *
     * @private
     */
    private static getDeviceScreenCoordinates(screenSize: Dimensions, coordinates: LocationCords): LocationCords {
        return {
            x: Math.round(screenSize.width * (coordinates.x / 100)),
            y: Math.round(screenSize.height * (coordinates.y / 100)),
        };
    }

    /**
     * Calculate the x y coordinates based on a percentage
     *
     * @param coordinates
     * @param percentage
     *
     * @return {{x: number, y: number}}
     *
     * @private
     */
    private static calculateXY({ x, y }, percentage): LocationCords {
        return {
            x: x * percentage,
            y: y * percentage,
        };
    }
}

export default Gestures;
