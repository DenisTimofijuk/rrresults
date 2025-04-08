export function createButtonForCollapse(taxonID: string | number) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'collapse-button', 'btn-sm');
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#observations-${taxonID}`);

    return button;
}