import { ExperResultData } from "../types/ExpertTableData.type";

export function generateTableForExpert(tableData: ExperResultData[]) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-bordered', 'table-sm');

    // Create table header
    const thead = document.createElement('thead');
    thead.classList.add('table-light');
    const headerRow = document.createElement('tr');

    // Define explicit column order (adjust based on your needs)
    const columnOrder = Object.keys(tableData[0]);

    columnOrder.forEach((columnName) => {
        const th = document.createElement('th');
        th.textContent = columnName;
        headerRow.appendChild(th);
    });

    // Add an extra header for action buttons if needed
    if (tableData.some(row => row.hasOwnProperty('actions'))) {
        const actionsHeader = document.createElement('th');
        actionsHeader.textContent = 'Actions';
        headerRow.appendChild(actionsHeader);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    tableData.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');

        // Process columns in the defined order
        columnOrder.forEach((key) => {
            const td = document.createElement('td');
            const value = rowData[key as keyof ExperResultData];

            if (key === "observation-url" && value) {
                // Create link for URL property
                const link = document.createElement('a');
                link.href = value.toString();
                link.textContent = 'iNaturalist';
                link.target = '_blank';
                td.appendChild(link);
            }
            else if (key === "points") {
                // Create a container for the radio buttons
                const radioContainer = document.createElement('div');
                radioContainer.classList.add('points-radio-group');

                // Create hidden input to store the actual value
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'points';
                hiddenInput.value = value?.toString() || '0';
                hiddenInput.dataset.rowIndex = rowIndex.toString();
                radioContainer.appendChild(hiddenInput);

                // Define the possible values
                const options = [0, 0.5, 1];

                // Create radio buttons for each option
                options.forEach(option => {
                    // const radioDiv = document.createElement('div');
                    // radioDiv.classList.add('form-check', 'form-check-inline');

                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.classList.add('form-check-input');
                    radioInput.name = `points-radio-${rowIndex}`;
                    radioInput.id = `points-${rowIndex}-${option}`;
                    radioInput.value = option.toString();
                    radioInput.checked = parseFloat(value.toString()) === option;

                    radioInput.addEventListener('change', () => {
                        // Update the hidden input when radio selection changes
                        hiddenInput.value = option.toString();
                        // Update rowData
                        rowData.points = option;
                    });

                    const radioLabel = document.createElement('label');
                    radioLabel.classList.add('form-check-label', 'hover-pointer');
                    radioLabel.htmlFor = `points-${rowIndex}-${option}`;
                    radioLabel.textContent = option.toString();

                    radioLabel.appendChild(radioInput);
                    // radioDiv.appendChild(radioLabel);
                    radioContainer.appendChild(radioLabel);
                });

                td.appendChild(radioContainer);
            }
            else if( key === "expert_review") {
                const reviewInput = document.createElement('textarea');
                reviewInput.value = value?.toString() || '';
                reviewInput.rows = 2;
                reviewInput.cols = 50;
                td.appendChild(reviewInput);
            }
            else {
                td.textContent = value?.toString() || '';
            }

            row.appendChild(td);
        });

        // Add action buttons if needed
        if (rowData.hasOwnProperty('actions')) {
            const actionsTd = document.createElement('td');

            // Example of adding an edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-sm', 'btn-primary', 'me-1');
            editButton.addEventListener('click', () => {
                // Handle edit action
                console.log('Edit row:', rowIndex);
            });
            actionsTd.appendChild(editButton);

            // Example of adding a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteButton.addEventListener('click', () => {
                // Handle delete action
                console.log('Delete row:', rowIndex);
                row.remove();
            });
            actionsTd.appendChild(deleteButton);

            row.appendChild(actionsTd);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

// TODO: ADD FILTER BUTTON TO HEADER