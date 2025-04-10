import { ExperResultData } from "../types/ExpertTableData.type";
import { createButtonForCollapse } from './expandButton';
import { createValidationComponent } from './validationComponent';
import ExpertDataManager from '../utils/ExpertDataManager';
import { generateSectionForObservations } from "../utils/displayObservations";
import { getHeaderName } from "../utils/getHeaderName";
import { createStatusElement } from "./statusElement";

export function generateTableForExpert(dataManager: ExpertDataManager) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-bordered', 'table-sm', 'table-secondary');
    table.id = 'expert-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add extra collumn for rows indexing:
    const indexCol = document.createElement('th');
    indexCol.textContent = 'Nr.'
    headerRow.appendChild(indexCol);

    // Add extra collumn for status indication:
    const statusCol = document.createElement('th');
    statusCol.textContent = getHeaderName("s");
    statusCol.classList.add('status-col');
    headerRow.appendChild(statusCol);

    dataManager.getHeaderColumnOrder().forEach((columnName) => {
        const th = document.createElement('th');
        th.setAttribute('scope', "col");
        th.textContent = getHeaderName(columnName);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    let rowNumber = 1;
    dataManager.dataset.forEach((rowData) => {
        const headerRow = document.createElement('tr');
        headerRow.setAttribute('taxon_id', rowData.taxon_id.toString());
        tbody.appendChild(headerRow);
        // Add extra collumn for rows indexing:
        const indexCol = document.createElement('td');
        indexCol.textContent = rowNumber.toString();
        headerRow.appendChild(indexCol);

        // Add extra column for status indication:
        const statusCell = document.createElement('td')
        statusCell.classList.add('status-cell');
        statusCell.appendChild(createStatusElement(rowData.taxon_id));
        headerRow.appendChild(statusCell);

        // Process columns in the defined order
        dataManager.getHeaderColumnOrder().forEach((key) => {
            const td = document.createElement('td');
            const value = rowData[key as keyof ExperResultData];

            if (key === "observations") {
                const wrapper = document.createElement('div');
                wrapper.classList.add('observations-panel-wrapper');
                td.appendChild(wrapper);

                const buttonWrapper = document.createElement('div');
                const collapseButton = createButtonForCollapse(rowData.taxon_id);
                buttonWrapper.appendChild(collapseButton);
                wrapper.appendChild(buttonWrapper);

                const observationCount = document.createElement('span');
                observationCount.classList.add('observation-count');
                observationCount.textContent = `Iš viso: (${dataManager.getRowData(rowData["taxon_id"])!.observations.length})`;
                wrapper.appendChild(observationCount);

                tbody.appendChild(generateSectionForObservations(rowData["taxon_id"], dataManager, collapseButton));

            } else if (key === "expert_review") {
                const container = document.createElement('div');
                container.classList.add('expert-review-container');

                const pointsContainer = document.createElement('div');
                pointsContainer.classList.add('points-container');
                                
                const groupValidationValue = dataManager.hasObservationGroupSamePoints(rowData['taxon_id']) ? dataManager.getRowData(rowData['taxon_id'])!.observations[0].points : '-Mixed';
                const groupValidationComponent = createValidationComponent([0, 0.5, 1, '-Mixed'], rowData['taxon_id'].toString(), groupValidationValue, 'btn-outline-success');
                pointsContainer.appendChild(groupValidationComponent);
                container.appendChild(pointsContainer);

                const reviewInput = document.createElement('textarea');
                reviewInput.value = value?.toString() || '';
                reviewInput.rows = 1;
                reviewInput.cols = 50;
                container.appendChild(reviewInput);

                td.appendChild(container);
            } else {
                td.textContent = value?.toString() || '';
            }

            headerRow.appendChild(td);
        });
        rowNumber++;
    });


    table.appendChild(tbody);
    return table;
}