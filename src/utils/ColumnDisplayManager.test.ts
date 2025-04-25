import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResultData } from '../types/Rezults.type';
import ColumnDisplayManager from './ColumnDisplayManager';
import { urlParameters } from './URLParametersHandler';


// Mock the URLParametersHandler
vi.mock('./URLParametersHandler', () => ({
  urlParameters: {
    update: vi.fn()
  }
}));

describe('ColumnDisplayManager', () => {
  let manager: ColumnDisplayManager;
  let mockTable: HTMLTableElement;
  let mockTableHead: HTMLTableSectionElement;
  let mockTableBody: HTMLTableSectionElement;
  let mockProgressSpan: HTMLSpanElement;
  let mockResults: ResultData;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Create mock DOM elements properly
    document.body.innerHTML = `
      <table id="results-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <span id="visible-column-progress"></span>
    `;
    
    mockTable = document.getElementById('results-table') as HTMLTableElement;
    mockTableHead = mockTable.tHead as HTMLTableSectionElement;
    mockTableBody = mockTable.tBodies[0];
    mockProgressSpan = document.getElementById('visible-column-progress') as HTMLSpanElement;
    
    // Create sample data
    mockResults = [
      {
        teamName: 'Team A',
        total: 0,
        data: {
          0: { title: 'Round 1', value: 10 },
          1: { title: 'Round 2', value: 15 },
          2: { title: 'Round 3', value: 20 }
        }
      },
      {
        teamName: 'Team B',
        total: 0,
        data: {
          0: { title: 'Round 1', value: 15 },
          1: { title: 'Round 2', value: 10 },
          2: { title: 'Round 3', value: 25 }
        }
      }
    ] as unknown as ResultData;
    
    // Create rows for each team
    mockResults.forEach(result => {
      const row = document.createElement('tr');
      row.dataset.team = result.teamName;
      
      const nameCell = document.createElement('td');
      nameCell.textContent = result.teamName;
      row.appendChild(nameCell);
      
      const totalCell = document.createElement('td');
      totalCell.textContent = '0';
      row.appendChild(totalCell);
      
      mockTableBody.appendChild(row);
    });
    
    // Mock getElementById for the progress span
    const originalGetElementById = document.getElementById;
    document.getElementById = vi.fn((id) => {
      if (id === 'visible-column-progress') {
        return mockProgressSpan;
      }
      return originalGetElementById.call(document, id);
    });
    
    // Initialize manager
    manager = new ColumnDisplayManager(mockResults, mockTable);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });
  
  test('constructor initializes properties correctly', () => {
    expect(manager.results).toBe(mockResults);
    expect(manager.table).toBe(mockTable);
  });
  
  test('updateSources method updates the sources and progress display', () => {
    const spy = vi.spyOn(manager as any, 'updateProgressDisplay');
    const newResults = [...mockResults] as unknown as ResultData;
    const newTable = document.createElement('table');
    
    manager.updateSources(newResults, newTable);
    
    expect(manager.results).toBe(newResults);
    expect(manager.table).toBe(newTable);
    expect(spy).toHaveBeenCalledOnce();
  });
  
  test('totalAvailableColumns returns the correct number of columns', () => {
    expect(manager.totalAvailableColumns).toBe(3);
    
    // Test with null results
    manager.results = null;
    expect(manager.totalAvailableColumns).toBe(0);
  });
  
  test('hasMoreColumns returns the correct boolean value', () => {
    // Initially no columns added, so should have more
    expect(manager.hasMoreColumns()).toBe(true);
    
    // Manually set currentColumnIndex to total columns
    (manager as any).currentColumnIndex = 3;
    expect(manager.hasMoreColumns()).toBe(false);
  });
  
  test('resetProgress resets the state correctly', () => {
    (manager as any).currentColumnIndex = 2;
    (manager as any).isAnimating = true;
    mockProgressSpan.textContent = '2 / 3';
    
    manager.resetProgress();
    
    expect((manager as any).currentColumnIndex).toBe(0);
    expect((manager as any).isAnimating).toBe(false);
    expect(mockProgressSpan.textContent).toBe('');
  });
  
  test('revealNextColumnAnimated adds a new column with animation', async () => {
    const result = await manager.revealNextColumnAnimated();
    
    // Should return true for successful addition
    expect(result).toBe(true);
    
    // Should have added a header
    const headerRow = mockTableHead.querySelector('tr');
    expect(headerRow?.children.length).toBe(3); // Team, Total, Round 1
    expect(headerRow?.lastChild?.textContent).toBe('Round 1');
    
    // Should have updated all rows
    const rowA = [...mockTableBody.children].find(
      r => (r as HTMLElement).dataset.team === 'Team A'
    ) as HTMLTableRowElement;
    const rowB = [...mockTableBody.children].find(
      r => (r as HTMLElement).dataset.team === 'Team B'
    ) as HTMLTableRowElement;
    
    // Both rows should have 3 cells now (name, total, Round 1)
    expect(rowA.cells.length).toBe(3);
    expect(rowB.cells.length).toBe(3);
    
    // Check values
    expect(rowA.cells[1].textContent).toBe('10'); // Total updated
    expect(rowA.cells[2].textContent).toBe('10'); // Round 1 value
    expect(rowB.cells[1].textContent).toBe('15'); // Total updated
    expect(rowB.cells[2].textContent).toBe('15'); // Round 1 value
    
    // Should have incremented currentColumnIndex
    expect((manager as any).currentColumnIndex).toBe(1);
    
    // Should have updated URL parameters
    expect(urlParameters.update).toHaveBeenCalledWith('column', '1');
    
    // Should have updated progress display
    expect(mockProgressSpan.textContent).toBe('1 / 3');
  });
  
  test('revealNextColumnAnimated returns false when no more columns', async () => {
    // Set currentColumnIndex to max
    (manager as any).currentColumnIndex = 3;
    
    const result = await manager.revealNextColumnAnimated();
    expect(result).toBe(false);
  });
  
  test('revealNextColumnAnimated returns false when already animating', async () => {
    // Set isAnimating flag
    (manager as any).isAnimating = true;
    
    const result = await manager.revealNextColumnAnimated();
    expect(result).toBe(false);
  });
  
  test('revealColumnsUpToIndex reveals columns up to the specified index', async () => {
    // Create a spy for revealNextColumnAnimated to prevent actual animation
    const animateSpy = vi.spyOn(manager, 'revealNextColumnAnimated');
    animateSpy.mockResolvedValue(true);
    
    // Reveal up to column 2 (should show columns 0 and 1)
    await manager.revealColumnsUpToIndex(2);
    
    // Should have called the private addColumnHeader method for column 0
    expect(mockTableHead.querySelector('tr')?.children.length).toBeGreaterThan(2);
    
    // Should have correctly set currentColumnIndex to 1 before animation
    // The animation call would increment it to 2
    expect((manager as any).currentColumnIndex).toBe(1);
    
    // Should have called revealNextColumnAnimated once
    expect(animateSpy).toHaveBeenCalledOnce();
  });
  
  test('revealColumnsUpToIndex does nothing if already past target index', async () => {
    // Set current column to 2
    (manager as any).currentColumnIndex = 2;
    
    const revealSpy = vi.spyOn(manager, 'revealNextColumnAnimated');
    
    await manager.revealColumnsUpToIndex(1);
    
    expect(revealSpy).not.toHaveBeenCalled();
  });
  
  test('updateTableSorting reorders rows by total score', async () => {
    // First reveal a column to set some scores
    // We'll mock the reveal so it doesn't actually try to animate
    vi.spyOn(manager, 'revealNextColumnAnimated').mockResolvedValue(true);
    
    // Manually manipulate totals for testing sorting
    mockResults[0].total = 5;  // Team A
    [...mockTableBody.children].find(
      r => (r as HTMLElement).dataset.team === 'Team A'
    )!.children[1].textContent = '5';
    
    mockResults[1].total = 20; // Team B
    [...mockTableBody.children].find(
      r => (r as HTMLElement).dataset.team === 'Team B'
    )!.children[1].textContent = '20';
    
    // Get the rows before sorting
    const rowsBefore = [...mockTableBody.children];
    expect(rowsBefore[0].getAttribute('data-team')).toBe('Team A');
    expect(rowsBefore[1].getAttribute('data-team')).toBe('Team B');
    
    // Call the private method
    await (manager as any).updateTableSorting();
    
    // Check rows after sorting
    const rowsAfter = [...mockTableBody.children];
    expect(rowsAfter[0].getAttribute('data-team')).toBe('Team B');
    expect(rowsAfter[1].getAttribute('data-team')).toBe('Team A');
  });
});