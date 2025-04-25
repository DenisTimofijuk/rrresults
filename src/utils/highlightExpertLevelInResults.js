/** 
 * This script highlights rows in the results table based on a minimum total score.
 * It is designed to be a standalone script that can be inserted into the page.
 * The main reason it is a standalone script is that it is for another branch of this project.
 * This script is not currently used here.
 */

(()=>{
    if (!window.location.search.includes('minTotalScore')) {
        const url = new URL(window.location.href);
        url.searchParams.set('minTotalScore', 400);
        window.history.pushState({}, '', url);
    }
    
    let timeoutId = setTimeout(checkIfLastColumnIsVisible, 4000)
    
    const button = document.getElementById('reveal-next');
    button.addEventListener('click', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkIfLastColumnIsVisible, 4000)
    });
    
    function checkIfLastColumnIsVisible() {
        const visibleColumnProgress = document.getElementById('visible-column-progress');
        const visibleColumnText = visibleColumnProgress.textContent;
        const visibleColumnCount = parseInt(visibleColumnText.split('/')[0].trim());
        const totalColumnCount = parseInt(visibleColumnText.split('/')[1].trim());
        if (visibleColumnCount === totalColumnCount) {
            highlightRowsWithScore();
            return;
        }
    }
    
    function highlightRowsWithScore() {
        const urlParams = new URLSearchParams(window.location.search);
        const minTotalScore = urlParams.get('minTotalScore') || 400;
        const minTotalScoreInt = parseInt(minTotalScore, 10);
        const wrapper = document.getElementById('results');
        const table = wrapper.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
    
        rows.forEach((row) => {
            const totalScore = row.querySelector('th:nth-child(2)');
            if (totalScore && parseInt(totalScore.textContent) >= minTotalScoreInt) {
                row.classList.add('table-dark');
            }
        });
    }
})();