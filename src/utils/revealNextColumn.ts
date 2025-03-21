import { ResultData } from '../types/Rezults.type';

let currentColumn = 0;
let isAnimating = false;

const visibleColumnProgress = document.getElementById('visible-column-progress') as HTMLSpanElement;

export function revealNextColumn(results: ResultData, table: HTMLTableElement) {
    if (currentColumn >= Object.entries(results[0].data).length || isAnimating) return;

    visibleColumnProgress.textContent = `${currentColumn + 1} / ${Object.entries(results[0].data).length}`;

    isAnimating = true;

    // Add column header
    const newHeader = document.createElement('th');
    newHeader.textContent = results[0].data[currentColumn].title;
    table.tHead!.rows.item(0)!.appendChild(newHeader);

    const tBody = table.tBodies[0];

    let animationsCompleted = 0;
    // Update rows
    results.forEach((rowData) => {
        const row = [...tBody.children].find(
            (r) => (r as HTMLElement).dataset.team === rowData.teamName
        ) as HTMLTableRowElement;
        const cell = document.createElement('td');
        row.appendChild(cell);
        if (!rowData.total) {
            rowData.total = 0;
        }
        animateScoreCounting(cell, rowData.data[currentColumn].value, () => {
            rowData.total! += rowData.data[currentColumn].value;
            animationsCompleted++;

            row.cells[1].textContent = rowData.total!.toString();

            if (animationsCompleted === results.length) {
                updateTableSorting(results, table);
                currentColumn++;
                isAnimating = false;
            }
        });
    });
}

function animateScoreCounting(cell: HTMLTableCellElement, targetValue: number, callback: CallableFunction) {
    let count = 0;
    const interval = setInterval(() => {
        count += Math.ceil(targetValue / 20);
        if (count >= targetValue) {
            count = targetValue;
            clearInterval(interval);
            if (callback) callback();
        }
        cell.textContent = count.toString();
    }, 50);
}

function updateTableSorting(results: ResultData, table: HTMLTableElement) {
    const sortedResults = [...results].sort((a, b) => b.total! - a.total!);
    const tBody = table.tBodies[0];
    const rows = [...tBody.children] as HTMLElement[];

    // Get current positions of rows
    const positions = rows.map((row) => row.getBoundingClientRect().top);

    // Reorder rows
    sortedResults.forEach((rowData) => {
        tBody.appendChild(rows.find((row) => (row as HTMLElement).dataset.team === rowData.teamName)!);
    });

    // Animate movement
    rows.forEach((row, index) => {
        const newPosition = row.getBoundingClientRect().top;
        const delta = positions[index] - newPosition;

        row.style.transition = 'none';
        row.style.transform = `translateY(${delta}px)`;

        requestAnimationFrame(() => {
            row.style.transition = 'transform 0.5s ease-in-out';
            row.style.transform = 'translateY(0)';
        });
    });
}

export function resetProgress() {
    currentColumn = 0;
    isAnimating = false;
    visibleColumnProgress.textContent = '';
}
