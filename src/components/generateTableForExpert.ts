import { Tooltip } from 'bootstrap'
import { ExperResultData, ObservationAuthor } from "../types/ExpertTableData.type";

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
        row.dataset['observationId'] = rowData['id'].toString() || '';

        // Process columns in the defined order
        columnOrder.forEach((key) => {
            const td = document.createElement('td');
            const value = rowData[key as keyof ExperResultData];

            if (key === "url" && value) {
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

                // Define the possible values
                const options = [0, 0.5, 1];

                // Create radio buttons for each option
                options.forEach(option => {
                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.classList.add('form-check-input');
                    radioInput.name = `points-radio-${rowIndex}`;
                    radioInput.id = `points-${rowIndex}-${option}`;
                    radioInput.value = option.toString();
                    radioInput.checked = parseFloat(value.toString()) === option;

                    const radioLabel = document.createElement('label');
                    radioLabel.classList.add('form-check-label', 'hover-pointer');
                    radioLabel.htmlFor = `points-${rowIndex}-${option}`;
                    radioLabel.textContent = option.toString();

                    radioLabel.appendChild(radioInput);
                    radioContainer.appendChild(radioLabel);
                });

                td.appendChild(radioContainer);
            }
            else if (key === "expert_review") {
                const reviewInput = document.createElement('textarea');
                reviewInput.value = value?.toString() || '';
                reviewInput.rows = 1;
                reviewInput.cols = 50;
                td.appendChild(reviewInput);
            }
            else if (key === "total_observations") {
                const observationsList = document.createElement('ol');
                (value as ObservationAuthor[]).forEach((observation) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${observation.team_name} - ${observation.user_name}`;
                    observationsList.appendChild(listItem);
                });
                // Create tooltip for the list
                const tooltipElement = document.createElement('span');
                tooltipElement.classList.add('tooltip-text', 'hover-pointer');
                tooltipElement.dataset.bsToggle = 'tooltip';
                tooltipElement.dataset.bsCustomClass = 'custom-tooltip';
                tooltipElement.dataset.bsHtml = 'true';
                tooltipElement.dataset.bsTitle = `<ol>${observationsList.innerHTML}</ol>`;
                tooltipElement.textContent = `${(value as ObservationAuthor[]).length} observations`;
                td.appendChild(tooltipElement);
                // Initialize Bootstrap tooltips
                new Tooltip(tooltipElement);
            } else {
                td.textContent = value?.toString() || '';
            }

            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}