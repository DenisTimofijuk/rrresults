import { ObservationData } from "../types/ExpertTableData.type";
import { getHeaderName } from "../utils/getHeaderName";
import { createStatusElement } from "./statusElement";
import { createValidationComponent } from "./validationComponent";

export function createTableForObservations(data: ObservationData[], observationColumnOreder: string[]) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-borderless', 'table-sm', 'observation-table');
    const thead = document.createElement('thead');
    thead.classList.add('table-light');
    const headerRow = document.createElement('tr');

    // create additional column for status indication:
    const statusTh = document.createElement('th');
    statusTh.setAttribute('scope', "col");
    statusTh.className = `status-col`;
    statusTh.textContent = getHeaderName("s");
    headerRow.appendChild(statusTh);

    observationColumnOreder.forEach((observationKey) => {
        if (observationKey === "id") return; // skip id column

        const th = document.createElement('th');
        th.textContent = getHeaderName(observationKey);
        th.setAttribute('scope', "col");
        th.className = `observation-column-${observationKey}`;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    data.forEach((observation) => {
        const observationRow = document.createElement('tr');
        observationRow.dataset['observationId'] = observation['id'].toString() || '';
        tbody.appendChild(observationRow);

        // create additional column for status indication:
        const statusCell = document.createElement('th');
        statusCell.className = 'status-cell';
        statusCell.appendChild(createStatusElement(observation['id']));
        observationRow.appendChild(statusCell);

        observationColumnOreder.forEach((observationKey) => {
            if (observationKey === "id") return; // skip id column

            const value = observation[observationKey as keyof ObservationData];
            const observationValue = (observation as any)[observationKey as keyof ObservationData];
            const td = document.createElement('td');

            if (observationKey === "url" && data) {
                const link = document.createElement('a');
                link.href = value as string;
                link.textContent = 'iNaturalist';
                link.target = '_blank';
                td.appendChild(link);
            } else if (observationKey === "points") {
                const radioContainer = createValidationComponent([0, 0.5, 1], observation['id'].toString(), observationValue as number);
                td.appendChild(radioContainer);
            } else {
                td.textContent = observationValue?.toString() || '';
            }

            observationRow.appendChild(td);
        });
    });

    return table;
}