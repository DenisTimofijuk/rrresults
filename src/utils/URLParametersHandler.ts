export const urlParameters = {
    update: (key: string, value: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },
    get: (key: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
    },
    delete: (key: string) => {
        const url = new URL(window.location.href);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    },
}