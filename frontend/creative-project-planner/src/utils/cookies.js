import JavascriptCookies from 'js-cookie';
import moment from 'moment';

const DEFAULT_OPTIONS = {
    secure: false,
    httpOnly: false,
    sameSite: 'strict',
    expires: moment().add(36000, 'seconds').toDate()
};

class Cookies {
    static instance;

    constructor() {
        if (Cookies.instance) {
            return Cookies.instance;
        }
        Cookies.instance = this;
    }

    static getInstance() {
        if (!Cookies.instance) {
            Cookies.instance = new Cookies();
        }
        return Cookies.instance;
    }

    set(key, value, options = {}) {
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
        const cookieValue = JSON.stringify(value);
        if (!cookieValue) {
            throw new Error(`Cookie value not provided`);
        }
        JavascriptCookies.set(key, cookieValue, mergedOptions);
    }

    get(key) {
        const cookieValue = JavascriptCookies.get(key);
        if (!cookieValue) {
            return undefined;
        }
        try {
            return JSON.parse(cookieValue);
        } catch (error) {
            return undefined;
        }
    }

    remove(key, options = {}) {
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
        JavascriptCookies.remove(key, mergedOptions);
    }
}

export default Cookies.getInstance();
