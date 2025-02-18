// import { ResultData } from "../types/Rezults";

// function generateResultTable(tableData: ResultData) {
//     const table = document.createElement('table');
//     table.classList.add('table');
//     table.classList.add('table-hover');
//     table.classList.add('table-bordered');
//     table.classList.add('table-sm');

//     // Create table header
//     const thead = document.createElement('thead');
//     thead.classList.add('table-light');
//     const headerRow = document.createElement('tr');
//     const headers = ['Komanda', 'Total', ...Object.keys(tableData[0].data), 'Komentarai'];
//     headers.forEach((text) => {
//         const th = document.createElement('th');
//         th.textContent = text;
//         headerRow.appendChild(th);
//     });
//     thead.appendChild(headerRow);
//     table.appendChild(thead);

//     // Create table body
//     const tbody = document.createElement('tbody');
//     tableData.forEach((rowData) => {
//         const row = document.createElement('tr');
//         const data = rowData.data;

//         const values = [rowData.teamName, 0, ...Object.values(data), rowData.comments.join()];

//         values.forEach((value) => {
//             const td = document.createElement('td');
//             td.textContent = value?.toString() || '';
//             row.appendChild(td);
//         });

//         tbody.appendChild(row);
//     });

//     table.appendChild(tbody);
//     return table;
// }