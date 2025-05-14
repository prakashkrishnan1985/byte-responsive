const storageUtil = {
    // LocalStorage Methods
    setItemLocal: <T>(key: string, value: T): void => {
        try {
            const data = typeof value === 'object' ? JSON.stringify(value) : value;
            localStorage.setItem(key, data as any);
        } catch (e) {
            console.error('Error setting data in localStorage:', e);
        }
    },

    getItemLocal: <T>(key: string): T | null => {
        try {
            const data = localStorage.getItem(key);
            if (data === null) return null;
    
            try {
                return JSON.parse(data) as T;
            } catch (e) {
                return data as T; 
            }
        } catch (e) {
            console.error('Error getting data from localStorage:', e);
            return null;
        }
    },
    

    removeItemLocal: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing data from localStorage:', e);
        }
    },

    clearLocal: (): void => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    },

    containsLocal: (key: string): boolean => {
        return localStorage.getItem(key) !== null;
    },

    // SessionStorage Methods
    setItemSession: <T>(key: string, value: T): void => {
        try {
            const data = typeof value === 'object' ? JSON.stringify(value) : value;
            sessionStorage.setItem(key, data as any);
        } catch (e) {
            console.error('Error setting data in sessionStorage:', e);
        }
    },

    getItemSession: <T>(key: string): T | null => {
        try {
            const data = sessionStorage.getItem(key);
            if (data === null) return null;
                try {
                return JSON.parse(data) as T;
            } catch (e) {
                return data as T; 
            }
        } catch (e) {
            console.error('Error getting data from sessionStorage:', e);
            return null;
        }
    },
    

    removeItemSession: (key: string): void => {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing data from sessionStorage:', e);
        }
    },

    clearSession: (): void => {
        try {
            sessionStorage.clear();
        } catch (e) {
            console.error('Error clearing sessionStorage:', e);
        }
    },

    containsSession: (key: string): boolean => {
        return sessionStorage.getItem(key) !== null;
    }
};

export default storageUtil;

