// src/utils/storage.js

const Storage = {
    setItem: (key, value) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    },

    getItem: (key) => {
        if (typeof window !== 'undefined') {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        return null;
    },

    removeItem: (key) => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(key);
        }
    },

    clear: () => {
        if (typeof window !== 'undefined') {
            sessionStorage.clear();
        }
    }
};

export default Storage;