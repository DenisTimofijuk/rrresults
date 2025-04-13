import { Collapse } from "bootstrap";

export function initiateDisplayOnlyCommentsFilter() {
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;
    const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
    onlyWithCommentsInput.addEventListener('change', () => {
        const table = resultPlaceHolder.querySelector('table#expert-table');
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const comment = row.querySelector('textarea');
                if (comment) {
                    row.classList.toggle('hide', onlyWithCommentsInput.checked && comment.value === '');
                }

                if (row.classList.contains('collapse')) {
                    const collapse = Collapse.getInstance(row);
                    collapse?.hide();
                }
            });
        }
    });
}