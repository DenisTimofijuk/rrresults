import { Collapse } from 'bootstrap'
import { ExperResultData, ObservationData } from "../types/ExpertTableData.type";
import { createTableForObservations } from './observationTable';
import { createButtonForCollapse } from './expandButton';

export function generateTableForExpert(tableData: ExperResultData[]) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-bordered', 'table-sm');

    // Create table header
    const thead = document.createElement('thead');
    thead.classList.add('table-light');
    const headerRow = document.createElement('tr');

    // Define explicit column order
    const headerColumnOrder = Object.keys(tableData[0]);
    const observationColumnOreder = Object.keys(tableData[0].observations[0]);

    headerColumnOrder.forEach((columnName) => {
        if (columnName === "taxon_id") return; // skip taxon_id column
        const th = document.createElement('th');
        th.textContent = columnName;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    tableData.forEach((rowData) => {
        const headerRow = document.createElement('tr');
        tbody.appendChild(headerRow);

        // Process columns in the defined order
        headerColumnOrder.forEach((key) => {
            if (key === "taxon_id") return; // skip taxon_id column

            const th = document.createElement('th');
            const value = rowData[key as keyof ExperResultData];

            if (key === "observations") {
                const collapseButton = createButtonForCollapse(rowData.taxon_id);
                th.appendChild(collapseButton);

                const observationRow = document.createElement('tr');
                observationRow.id = `observations-${rowData.taxon_id}`;
                observationRow.classList.add('collapse');
                const dummyCell = document.createElement('td');
                dummyCell.colSpan = headerColumnOrder.length;
                observationRow.appendChild(dummyCell);
                tbody.appendChild(observationRow);
                
                new Collapse(observationRow, {
                    toggle: false // Prevent automatic toggling
                });                
                
                observationRow.addEventListener('show.bs.collapse', () => {
                    collapseButton.classList.add('active');
                    const isExpanded = observationRow.getAttribute('aria-expanded') === 'true';

                    if (!isExpanded) {
                        observationRow.setAttribute('aria-expanded', 'true');
                        const observationsTable = createTableForObservations(value as ObservationData[], observationColumnOreder);
                        dummyCell.appendChild(observationsTable);
                    }
                });
                observationRow.addEventListener('hidden.bs.collapse', () => {
                    collapseButton.classList.remove('active');
                });

                const observationCount = document.createElement('span');
                observationCount.classList.add('observation-count');
                observationCount.textContent = `Iš viso: (${(value as ObservationData[]).length})`;
                th.appendChild(observationCount);
            } else {
                th.textContent = value?.toString() || '';
            }
            headerRow.appendChild(th);


            // else if (key === "expert_review") {
            //     const reviewInput = document.createElement('textarea');
            //     reviewInput.value = value?.toString() || '';
            //     reviewInput.rows = 1;
            //     reviewInput.cols = 50;
            //     td.appendChild(reviewInput);
            // }


        });
    });

    table.appendChild(tbody);
    return table;
}