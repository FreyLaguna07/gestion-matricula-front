import { ICellRendererParams } from 'ag-grid-community';

export enum EnumButtonType {
	TYPE_EDIT = 'TYPE_EDIT',
  TYPE_DELETE = 'TYPE_DELETE',
	TYPE_ADD = 'TYPE_ADD',
  TYPE_VER_RD = 'TYPE_VER_RD',
  TYPE_MATRICULAR = 'TYPE_MATRICULAR',
}

export interface DisabledFuc {
	(params: ICellRendererParams): boolean;
}

export type RowSelection = 'multiple' | 'single';

export interface SubMenu {
	buttonType: EnumButtonType | string;
	label: string;
	icon?: string;
	iconClass?: string;
	disabled?: boolean;
	// classList?: string;
	submenu?: SubMenu[];
}
export interface TooltipOption {
	label: string;
	classList?: string;
}

export interface IconOption {
	icon: string;
	classList?: string;
}

export interface ButtonHeader {
	visible: boolean;
	disabled?: boolean;
	allowTypeFiles?: string;
}

export interface PropertyButtonHeader {
	visible: boolean;
	disabled: boolean;
}

export interface ConfigButtonAction {
	header?: ConfigButtonHeader;
	agGrid?: {
		defaultAction?: boolean;
		actions: ConfigButtonAgGrid[];
	};
}

export interface ConfigButtonAgGrid {
	actionCode: EnumButtonType | string;
	tooltipOption: TooltipOption;
	iconOption: IconOption;
	disabled?: boolean | DisabledFuc;
	submenu?: SubMenu[];

}

export interface ConfigButtonHeader {
	disabled?: boolean;
	submenu?: SubMenu[];
}
