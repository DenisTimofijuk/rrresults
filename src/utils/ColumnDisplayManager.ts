import { DataRow, ResultData } from "../types/Rezults.type";
import { urlParameters } from "./URLParametersHandler";

/**
 * Class to manage table column display and animations
 */
export default class ColumnDisplayManager {
  private currentColumnIndex = 0;
  private isAnimating = false;
  private visibleColumnProgress: HTMLSpanElement;

  constructor(public results: ResultData | null, public table: HTMLTableElement | null) {
    this.results = results;
    this.table = table;
    this.visibleColumnProgress = document.getElementById('visible-column-progress') as HTMLSpanElement;
  }

  updateSources(results: ResultData, table: HTMLTableElement) {
    this.results = results;
    this.table = table;
    this.updateProgressDisplay();
  }

  /**
   * Update the visible progress counter in the UI
   */
  private updateProgressDisplay(): void {
    this.visibleColumnProgress.textContent = `${this.currentColumnIndex} / ${this.totalAvailableColumns}`;
  }

  get totalAvailableColumns(): number {
    return this.results ? Object.entries(this.results[0].data).length : 0;
  }

  /**
   * Check if we can show more columns
   */
  hasMoreColumns(): boolean {
    return this.currentColumnIndex < this.totalAvailableColumns;
  }

  /**
   * Reset progress and animations
   */
  resetProgress(): void {
    this.currentColumnIndex = 0;
    this.isAnimating = false;
    this.visibleColumnProgress.textContent = '';
  }

  /**
   * Add a single column header to the table
   * @param columnIndex The index of the column to add
   */
  private addColumnHeader(columnIndex: number): void {
    const newHeader = document.createElement('th');
    newHeader.textContent = this.results![0].data[columnIndex].title;
    
    const headRow = this.table!.tHead!.querySelector('tr');
    headRow!.appendChild(newHeader);
  }

  /**
   * Add a column cell to a row
   * @param rowData Data for this row
   * @param columnIndex The column index being added
   * @param animated Whether to animate the score counting
   * @returns Promise that resolves when animation completes (or immediately if not animated)
   */
  private addColumnCell(rowData: DataRow, columnIndex: number, animated = false): Promise<void> {
    return new Promise((resolve) => {
      const tBody = this.table!.tBodies[0];
      const row = [...tBody.children].find(
        (r) => (r as HTMLElement).dataset.team === rowData.teamName
      ) as HTMLTableRowElement;

      // Create and append the cell
      const cell = document.createElement('td');
      row.appendChild(cell);

      // Initialize total if needed
      if (!rowData.total) {
        rowData.total = 0;
      }

      const value = rowData.data[columnIndex].value;

      if (animated) {
        // Animate the score counting
        this.animateScoreCounting(cell, value, () => {
          rowData.total! += value;
          row.cells[1].textContent = rowData.total!.toString();
          resolve();
        });
      } else {
        // Just set the value without animation
        cell.textContent = value.toString();
        rowData.total! += value;
        row.cells[1].textContent = rowData.total!.toString();
        resolve();
      }
    });
  }

  /**
   * Animate counting up to a target value
   */
  private animateScoreCounting(
    cell: HTMLTableCellElement,
    targetValue: number,
    callback: () => void
  ): void {
    let count = 0;
    const increment = Math.max(1, Math.ceil(targetValue / 20));

    const interval = setInterval(() => {
      count += increment;
      if (count >= targetValue) {
        count = targetValue;
        clearInterval(interval);
        callback();
      }
      cell.textContent = count.toString();
    }, 50);
  }

  /**
   * Update table sorting based on total scores
   */
  private updateTableSorting(): void {
    const sortedResults = [...this.results!].sort((a, b) => b.total! - a.total!);
    const tBody = this.table!.tBodies[0];
    const rows = [...tBody.children] as HTMLElement[];

    // Get current positions of rows
    const positions = rows.map((row) => row.getBoundingClientRect().top);

    // Reorder rows
    sortedResults.forEach((rowData) => {
      const row = rows.find((r) => r.dataset.team === rowData.teamName)!;
      tBody.appendChild(row);
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

  /**
   * Reveal next column with animation
   */
  async revealNextColumnAnimated(): Promise<boolean> {
    if (!this.hasMoreColumns() || this.isAnimating) {
      return false;
    }

    this.isAnimating = true;
    this.addColumnHeader(this.currentColumnIndex);

    // Add cells for all rows with animation
    const animationPromises = this.results!.map(rowData =>
      this.addColumnCell(rowData, this.currentColumnIndex, true)
    );

    // Wait for all animations to complete
    await Promise.all(animationPromises);

    this.updateTableSorting();
    this.currentColumnIndex++;
    this.isAnimating = false;
    this.updateProgressDisplay();
    urlParameters.update('column', this.currentColumnIndex.toString());

    return true;
  }

  /**
   * Reveal all columns up to specified index
   */
  revealColumnsUpToIndex(targetIndex: number): void {
    // Safety check
    const maxColumnIndex = this.totalAvailableColumns - 1;
    targetIndex = Math.min(targetIndex-1, maxColumnIndex);

    // If we're already past the target index, do nothing
    if (this.currentColumnIndex > targetIndex) {
      return;
    }

    // Add columns without animation up to targetIndex-1
    while (this.currentColumnIndex < targetIndex) {
      this.addColumnHeader(this.currentColumnIndex);

      this.results!.forEach(rowData => {
        this.addColumnCell(rowData, this.currentColumnIndex, false);
      });

      this.currentColumnIndex++;
    }

    this.revealNextColumnAnimated();
  }
}