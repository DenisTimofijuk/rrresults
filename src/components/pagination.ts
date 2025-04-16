import { PageChanged } from "../types/customEvents.type";

export function generatePagination(totalPages: number, startingPage: string) {    
    let currentPage = parseInt(startingPage, 10);
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
        fireChangeEvent(pagination, currentPage);
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
            fireChangeEvent(pagination, value);
        }, `${value}`);
        pagination.appendChild(li);

        if (value === currentPage) {
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
        fireChangeEvent(pagination, currentPage);

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

function handleActivePageIndicaton(pagination: HTMLUListElement, element: HTMLLIElement) {
    const active = pagination.querySelector('.active') as HTMLLIElement;
    if (active) {
        active.classList.remove('active');
    }
    element.classList.add('active');
}

function fireChangeEvent(pagination: HTMLElement, value: number) {
    const event = new CustomEvent<PageChanged>('pageChanged', { detail: { page: value } });
    pagination.dispatchEvent(event);
}