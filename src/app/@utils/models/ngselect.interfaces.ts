export interface NgSelect {
	label: string;
	value: string | number | null | undefined;
}

export type NgSelectOption<T> = T & NgSelect;
