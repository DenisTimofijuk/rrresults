import { getRandomMessage } from "./errorMessage";

export function displayAlert() {
    const loader = document.getElementById('loader-wrapper') as HTMLDivElement;
    loader.classList.add('hide');

    const errorText = document.getElementById('error-text') as HTMLDivElement;
    errorText.innerText = getRandomMessage();

    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;
    alertErrorwrapper.classList.remove('hide');
}

export function hideAlert() {
    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;
    alertErrorwrapper.classList.add('hide');
}