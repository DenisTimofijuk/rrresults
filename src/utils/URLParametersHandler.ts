export function updateURLParameter(key: string, value: string) {
    // Get the current URL
    const url = new URL(window.location.href);

    url.searchParams.set(key, value);

    // Update the URL without reloading the page
    window.history.pushState({}, '', url);
}

export function getURLParameter(key: string) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}