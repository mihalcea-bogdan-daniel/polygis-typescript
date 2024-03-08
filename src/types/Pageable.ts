interface Sort {
	sorted: boolean;
	unsorted: boolean;
	empty: boolean;
}

interface Pageable {
	pageNumber: number;
	pageSize: number;
	sort: Sort;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}

export interface ApiPageable<T> {
	content: T[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	numberOfElements: number;
	size: number;
	number: number;
	sort: Sort;
	first: boolean;
	empty: boolean;
}