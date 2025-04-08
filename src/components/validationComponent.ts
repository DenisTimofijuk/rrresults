export function createValidationComponent(availableValidationPoints: Array<number | string>, id: string, existingValue: number|string, buttonDesignClassName: string = 'btn-outline-secondary'): HTMLDivElement {
    const radioContainer = document.createElement('div');
    radioContainer.classList.add('points-radio-group', 'btn-group');
    radioContainer.setAttribute('role', 'group');
    radioContainer.setAttribute('aria-label', 'Points validation options');

    availableValidationPoints.forEach((value, index) => {
        const inputId = `points-${id}-${index}`;

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.classList.add('form-check-input', 'btn-check');
        radioInput.setAttribute('autocomplete', 'off');
        radioInput.name = `points-radio-${id}`;
        radioInput.id = inputId;
        radioInput.value = value.toString();
        radioInput.checked = existingValue === value;

        // radioInput.addEventListener('change', () => {
        //     radioContainer.setAttribute('data-value', value.toString());
        // });
        // radioContainer.setAttribute('data-value', existingValue.toString());

        const radioLabel = document.createElement('label');
        radioLabel.classList.add('form-check-label', 'hover-pointer', 'btn', 'btn-sm');
        radioLabel.classList.add(buttonDesignClassName);
        radioLabel.htmlFor = inputId;
        radioLabel.textContent = value.toString();

        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);

        if (value === '-Mixed') {
            radioInput.disabled = true;
            radioLabel.classList.add('disabled');
        }
    });

    return radioContainer;
}