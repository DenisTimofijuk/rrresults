export function createValidationComponent(availableValidationPoints: number[], observation_id: string, existingValue: number) {
    const radioContainer = document.createElement('div');
    radioContainer.classList.add('points-radio-group');

    availableValidationPoints.forEach((value, index) => {
        const inputId = `points-${observation_id}-${index}`;

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.classList.add('form-check-input');
        radioInput.name = `points-radio-${observation_id}`;
        radioInput.id = inputId;
        radioInput.value = value.toString();
        radioInput.checked = existingValue === value;

        const radioLabel = document.createElement('label');
        radioLabel.classList.add('form-check-label', 'hover-pointer');
        radioLabel.htmlFor = inputId;
        radioLabel.textContent = value.toString();

        radioLabel.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);
    });

    return radioContainer;
}