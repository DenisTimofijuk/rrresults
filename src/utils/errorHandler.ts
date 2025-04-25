import { getRandomMessage } from "./errorMessage";

export function displayAlert() {
    const loader = document.getElementById('loader-wrapper') as HTMLDivElement;
    if (loader) loader.classList.add('hide');

    const errorText = document.getElementById('error-text') as HTMLDivElement;
    if (errorText) errorText.innerText = getRandomMessage();

    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;
    if (alertErrorwrapper) alertErrorwrapper.classList.remove('hide');
}

export function hideAlert() {
    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;
    if (alertErrorwrapper) alertErrorwrapper.classList.add('hide');
}