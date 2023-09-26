/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Directive, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgSelect, NgSelectOption } from './ngselect.interfaces';

// TODO: Add Angular decorator.
@Directive()
export class FormUtil implements OnDestroy {
	private readonly _subscription$: Subscription;

	constructor() {
		this._subscription$ = new Subscription();
	}

	/**
	 *
	 * @param controlName nombre del control
	 * @param data
	 * @param first
	 * @param id
	 */
	setNgSelectOption<T extends Array<any>>(controlName: AbstractControl | null, data: Observable<T>, first?: boolean, id?: number | string | null): Promise<T[0] | null> {
		if (controlName == null || !data) return Promise.resolve(null);

		return new Promise((resolve, reject) => {
			this._subscription$.add(
				data.pipe(map((d) => d as unknown as NgSelectOption<any[]>)).subscribe((list) => {
					try {
						if (list.length > 0) {
							if (first) {
								controlName.setValue(list[0]);
								console.log(list[0]);
								resolve(list[0]);
							} else if (id) {
								const item = list.find((l) => (l as unknown as NgSelect).value === id) as T;
								console.log(item);
								controlName.setValue(item);
								resolve(item);
							}
						}

						controlName.setValue(null);
						resolve(null);
					} catch (error) {
						reject(error);
					}
				})
			);
		});
	}

	/**
	 *
	 * @param data
	 * @param first si el valor es `true` seleciona el primer objecto de lo contario selecciona el ultimo valor
	 */
	setNgSelectOptionAsync(data: Observable<any[]>, first: boolean): Promise<any>;
	/**
	 *
	 * @param data
	 * @param id busca por la propiedad del `value` del objeto `data`
	 */
	setNgSelectOptionAsync(data: Observable<any[]>, id: number): Promise<any>;
	/**
	 *
	 * @param data
	 * @param property nombre de la propiedad del objecto `data`
	 * @param value valor para comparar con la `property`
	 */
	setNgSelectOptionAsync(data: Observable<any[]>, property: string, value: string | number): Promise<any>;
	setNgSelectOptionAsync() {
		const arguments$ = arguments;
		const data = arguments$[0] as Observable<any[]>;

		return new Promise<any>((resolve) => {
			if (data) {
				this._subscription$.add(
					data.subscribe(
						(options) => {
							if (options.length > 0) {
								const first_id_property = arguments$[1];

								//
								if (arguments$.length === 2) {
									if (typeof first_id_property === 'boolean') {
										if (first_id_property) resolve(options[0]);
										else resolve(options[options.length - 1]);
									} else if (typeof first_id_property === 'number') {
										const option = options.find((option) => option.value === first_id_property);
										if (option) resolve(option);
									}

									resolve(null);
								}

								//
								if (arguments$.length === 3) {
									const value = arguments$[2];

									const option = options.find((option) => {
										if (option[first_id_property] !== null && option[first_id_property] !== undefined) {
											if (typeof value === 'string') {
												if (option[first_id_property].toString().trim() == value.trim()) return option;
											} else if (typeof value === 'number') {
												if (option[first_id_property] == value) return option;
											}

											return null;
										}

										return null;
									});

									if (option !== null) resolve(option);
									else resolve(null);
								}
							} else resolve(null);
						},
						() => {
							resolve(null);
						}
					)
				);
			} else resolve(null);
		});
	}

	ngOnDestroy(): void {
		this._subscription$.unsubscribe();
	}
}

export function convertStringToType<T>(s: string | null): T | null {
	if (s == null) return null;

	if (s.trim() == '') return null;

	try {
		return JSON.parse(s) as T;
	} catch {
		return null;
	}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const OMIT_PROPERTY = ['links', 'label', 'value'];

export interface CompareResult<T = any> {
	value: T;
	equal: boolean;
}

export function isObject<T>(object: T): boolean {
	return object !== null && typeof object === 'object';
}

export function isObjEmpty<T>(object: T): boolean {
	if (object === null || object === undefined) return true;

	return Object.keys(object).length === 0;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function deepEqual<T extends Object>(object1: T, object2: T): boolean {
	// const keys1 = Object.keys(object1).filter((key) => !OMIT_PROPERTY.includes(key));

	const keys1 = Object.keys(Object.fromEntries(Object.entries(object1).filter(([k, v]) => v != null))).filter((key) => !OMIT_PROPERTY.includes(key));
	// .filter((key) => key.substr(0, 2) === 'id');

	// const keys2 = Object.keys(object2).filter((key) => !OMIT_PROPERTY.includes(key));
	const keys2 = Object.keys(Object.fromEntries(Object.entries(object2).filter(([k, v]) => v != null))).filter((key) => !OMIT_PROPERTY.includes(key));
	// .filter((key) => key.substr(0, 2) === 'id');

	// console.log({ keys1, keys2 });

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		const k = key as keyof T;

		const val1 = object1[k];
		const val2 = object2[k];

		const isObjects = isObject(val1) && isObject(val2);

		let newVal1: any = {};
		let newVal2: any = {};

		const isId = {
			newVal1: false,
			newVal2: false,
		};

		if (isObjects) {
			// console.log({ val1, val2 });
			for (const v in val1) {
				if (v.substring(0, 2) && v.substring(0, 2) === 'id') {
					newVal1[v] = val1[v];
					isId.newVal1 = true;
					break;
				}
			}
			for (const v in val2) {
				if (v.substring(0, 2) && v.substring(0, 2) === 'id') {
					newVal2[v] = val2[v];
					isId.newVal2 = true;
					break;
				}
			}

			if (!isId.newVal1 && !isId.newVal2) {
				newVal1 = object1[k];
				newVal2 = object2[k];
				// console.log(true);
			}
		} else {
			newVal1 = object1[k];
			newVal2 = object2[k];
		}

		// console.log({ newVal1, newVal2 });

		if ((isObjects && !deepEqual(newVal1, newVal2)) || (!isObjects && newVal1 !== newVal2)) {
			return false;
		}
	}

	return true;
}

type D = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

function equals<T>(o1: T, o2: T): boolean {
	if (o1 === o2) return true;
	if (o1 === null || o2 === null) return false;
	if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN

	const t1 = typeof o1;
	const t2 = typeof o2;

	let length: number, keySet: any;

	if (t1 == t2 && t1 == 'object') {
		if ((o1 as D)['label']) delete (o1 as D)['label'];
		if ((o1 as D)['links']) delete (o1 as D)['links'];

		if ((o2 as D)['label']) delete (o2 as D)['label'];
		if ((o2 as D)['links']) delete (o2 as D)['links'];

		if (Array.isArray(o1)) {
			if (!Array.isArray(o2)) return false;

			if ((length = o1.length) == o2.length) {
				for (let k = 0; k < length; k++) {
					if (!equals(o1[k], o2[k])) return false;
				}
				return true;
			}
		} else {
			if (Array.isArray(o2)) {
				return false;
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			keySet = Object.create(null);

			for (const key in o1) {
				if (!equals(o1[key] ?? null, o2?.[key] ?? null)) {
					return false;
				}
				keySet[key] = true;
			}

			for (const key in o2) {
				if (!(key in keySet) && typeof o2[key] !== 'undefined') {
					return false;
				}
			}

			return true;
		}
	}
	return false;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function compareObject<T extends Object>(objectCurrent: T, objectTemp: T): CompareResult<T> {
	const isEqual = equals(objectCurrent, objectTemp);
	return {
		value: objectCurrent,
		equal: isEqual,
	};
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function generateUUID(): string {
	let d = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});

	return uuid;
}

export function completedCharacter(value: string, count: number, character = '0'): string {
	if (value == null) return '';

	const length = value.trim().length;
	let completed = '';

	for (let i = length; i < count; i++) {
		completed += character;
	}

	return completed + value;
}

function convertToType<T>(formControl: AbstractControl | null): Required<T> | null {
	if (formControl == null) return null;

	const formValue = formControl.value as unknown;

	if (formValue == null) return null;

	if (typeof formValue === 'object') {
		const object = formValue as NgSelectOption<T> & { links: [] };

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { label, value, links, ...res } = object;
		return { ...res } as unknown as Required<T>;
	}

	return formValue as Required<T>;
}

function clearObject<T>(object: T): T | null {
	if (object && typeof object === 'object') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const e = object as NgSelectOption<any> & { links: [] };
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
		const { label, value, links, ...res } = e;

		if (isObjEmpty(res)) return null;
		return res as T;
	}
	return object;
}

export function convertFormGroupToModel<T>(formGroup: FormGroup, strict = false): Required<T> {
	if (!strict) return { ...formGroup.getRawValue() } as Required<T>;

	const object = formGroup.getRawValue() as Required<T>;
	// eslint-disable-next-line prefer-const
	let obj: { [key: string]: any } = {};

	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const element = object[key];
			if (element && typeof element === 'object') {
				if (Array.isArray(element)) {
					obj[key] = (element as unknown as []).map(clearObject);
				} else {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const e = element as NgSelectOption<any> & { links: [] };
					// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
					const { label, value, links, ...res } = e;

					if (isObjEmpty(res)) obj[key] = null;
					else obj[key] = res as unknown;
				}
			} else {
				obj[key] = element;
			}
		}
	}
	return obj as Required<T>;
}

export function convertFormToType<T>(form: FormControl | AbstractControl | null): Required<T> | null;
export function convertFormToType<T, K>(form: FormGroup, property: keyof K): Required<T> | null;
export function convertFormToType<T, K>(form: FormControl | AbstractControl | FormGroup | null, property?: keyof K): Required<T> | null {
	if (form == null) return null;

	if (form instanceof FormControl) return convertToType<T>(form);

	if (form instanceof FormGroup) {
		return convertToType<T>(form.get(property as any));
	}

	return null;
}

export function convertObserverToPromise<T>(...observer: Observable<T>[]): Promise<T | undefined>[]{
  return observer.map((o) => o.toPromise());
}
