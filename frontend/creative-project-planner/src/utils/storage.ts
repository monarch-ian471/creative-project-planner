// src/utils/storage.ts

const Storage = {
    setItem: (key: string, value: any): void => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    },

    getItem: (key: string): any | null => {
        if (typeof window !== 'undefined') {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        return null;
    },

    removeItem: (key: string): void => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(key);
        }
    },

    clear: (): void => {
        if (typeof window !== 'undefined') {
            sessionStorage.clear();
        }
    }
};

export default Storage;