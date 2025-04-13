import { PageChanged } from "../types/customEvents.type";
import { urlParameters } from "../utils/URLParametersHandler";

export function generatePagination(totalPages: number) {
    // TODO: handle large number of pages

    // Solve issue if table is generated on page load
    // or was it generated on button click
    // if it was on page load, we do not delete url parameter


    urlParameters.delete('page');
    // there is nothing to collect now because we are deleting it:
    let page = urlParameters.get('page');

    if (page === null) {
        page = '1';
    } else {
        page = page.toString();
    }
    let currentPage = parseInt(page, 10);
    const paginationItems:HTMLLIElement[] = [];

    const pagination = document.createElement('ul');
    pagination.className = 'pagination justify-content-end';
    const previous = generatePaginationElement(() => {
        currentPage--;
        if (currentPage < 1) {
            currentPage = 1;
            return
        }
        handleActivePageIndicaton(pagination, paginationItems[currentPage - 1]);
        fireChangeEvent(currentPage);
    }, '', '<span aria-hidden="true">&laquo;</span>');
    pagination.appendChild(previous);

    for (let i = 0; i < totalPages; i++) {
        const value = i + 1;
        const li = generatePaginationElement(() => {
            if (li.classList.contains('active')) {
                return;
            }
            currentPage = value;
            handleActivePageIndicaton(pagination, li);
            fireChangeEvent(value);
        }, `${value}`);
        pagination.appendChild(li);

        if (value === 1) {
            li.classList.add('active');
        }
        paginationItems.push(li);
    }

    const next = generatePaginationElement(() => {
        currentPage++;
        if (currentPage > totalPages) {
            currentPage = totalPages;
            return;
        }
        handleActivePageIndicaton(pagination, paginationItems[currentPage - 1]);
        fireChangeEvent(currentPage);

    }, '', '<span aria-hidden="true">&raquo;</span>');
    pagination.appendChild(next);

    return pagination;
}

function generatePaginationElement(handler: (e: Event) => void, text: string, innerElement?: string) {
    const li = document.createElement('li');
    li.className = 'page-item';
    const a = document.createElement('a');
    a.className = 'page-link link-success';
    a.href = 'javascript:void(0)'; // Prevent default link behavior

    a.addEventListener('click', handler)

    if (innerElement) {
        a.innerHTML = innerElement;
    } else {
        a.textContent = text;
    }
    li.appendChild(a);

    return li;
}

function handleActivePageIndicaton(pagination: HTMLUListElement, li: HTMLLIElement) {
    const active = pagination.querySelector('.active') as HTMLLIElement;
    if (active) {
        active.classList.remove('active');
    }
    li.classList.add('active');
}

function fireChangeEvent(value: number) {
    urlParameters.update('page', `${value}`);
    const event = new CustomEvent<PageChanged>('pageChanged', { detail: { page: value } });
    document.dispatchEvent(event);
}