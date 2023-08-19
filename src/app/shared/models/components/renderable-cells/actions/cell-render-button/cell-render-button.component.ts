import { Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ConfigButtonAgGrid, EnumButtonType } from 'src/app/@utils/models/sc-ag-grid.interface';

let nextId = 0;

@Component({
	selector: 'cell-render-button',
	templateUrl: './cell-render-button.component.html',
	styles: [
		`
			.ag-grid-button__action {
				border: none;
				border-radius: 50%;
				padding: 0 !important;
				text-align: center;
				margin: 0.1em;
				background-color: transparent;
			}
		`,
		`
			.ag-grid-button__action i {
				display: block;
				width: 1.7em;
				height: 1.7em;
				line-height: 1.7em;
			}
		`,
	],
	host: {
		'[id]': '_idButton',
		class: 'd-flex justify-content-center',
	},
	encapsulation: ViewEncapsulation.None,
})
export class CellRendererButtonComponent implements ICellRendererAngularComp {
	_idButton = `cell-render-button-${++nextId}`;

	private _params!: ICellRendererParams;
	_configButtons!: ConfigButtonAgGrid[];

	agInit(params: ICellRendererParams): void {
		this._params = params;
		this._configButtons = params.context.componentParent.configButtonsAction.agGrid.actions;
	}

	onButtonActionEmit(typeButton: EnumButtonType | string) {
		if (typeButton) this._params.context.componentParent.onButtonActionAgGridEmit(this._params.node.rowIndex, typeButton);
	}

	refresh(_: any): boolean {
		return false;
	}
}
