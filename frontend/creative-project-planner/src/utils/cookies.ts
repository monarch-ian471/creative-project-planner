import JavascriptCookies, { CookieAttributes } from 'js-cookie';
import moment from 'moment';

const DEFAULT_OPTIONS: CookieAttributes = {
    secure: false,
    sameSite: 'strict',
    expires: moment().add(36000, 'seconds').toDate()
};

class Cookies {
    private static instance: Cookies;

    private constructor() {
        if (Cookies.instance) {
            return Cookies.instance;
        }
        Cookies.instance = this;
    }

    public static getInstance(): Cookies {
        if (!Cookies.instance) {
            Cookies.instance = new Cookies();
        }
        return Cookies.instance;
    }

    public set<T>(key: string, value: T, options: CookieAttributes = {}): void {
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
        const cookieValue = JSON.stringify(value);
        if (!cookieValue) {
            throw new Error(`Cookie value not provided`);
        }
        JavascriptCookies.set(key, cookieValue, mergedOptions);
    }

    public get<T>(key: string): T | undefined {
        const cookieValue = JavascriptCookies.get(key);
        if (!cookieValue) {
            return undefined;
        }
        try {
            return JSON.parse(cookieValue) as T;
        } catch (error) {
            return undefined;
        }
    }

    public remove(key: string, options: CookieAttributes = {}): void {
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
        JavascriptCookies.remove(key, mergedOptions);
    }
}

export default Cookies.getInstance();
