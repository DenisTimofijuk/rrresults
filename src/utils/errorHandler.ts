import { getRandomMessage } from "./errorMessage";

export function displayAlert() {
    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;
    const loader = document.getElementById('loader-wrapper');
    
    loader?.classList.add('hide');
    document.getElementById('error-text')!.innerText = getRandomMessage();
    alertErrorwrapper.classList.remove('hide');
}

export function hideAlert() {
    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;
    alertErrorwrapper.classList.add('hide');
}