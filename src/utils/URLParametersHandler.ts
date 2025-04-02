export function updateURLParameter(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

export function getURLParameter(key: string) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}