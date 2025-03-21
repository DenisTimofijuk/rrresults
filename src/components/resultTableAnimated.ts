import { ResultData } from '../types/Rezults.type';

export function initResultTable(tableData: ResultData) {
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-hover');
    table.classList.add('table-bordered');
    table.classList.add('table-sm');

    // Create table header
    const thead = document.createElement('thead');
    thead.classList.add('table-light');
    const headerRow = document.createElement('tr');
    headerRow.setAttribute('id', 'header-row');

    const headers = ['Komanda', 'Total'];
    headers.forEach((text) => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    const sortedTeams = tableData.sort((a, b) => a.teamName.localeCompare(b.teamName));
    sortedTeams.forEach((rowData) => {
        const row = document.createElement('tr');
        row.dataset.team = rowData.teamName;

        const values = [rowData.teamName, 0];

        values.forEach((value) => {
            const td = document.createElement('th');
            td.textContent = value?.toString() || '';
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}