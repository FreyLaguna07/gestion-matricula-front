import { Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
	selector: 'edit-delete',
	template: `
		<button (click)="invokeParentMethod_edit()" class="btn btn-transparent px-2 py-0" matTooltip="Modificar" matTooltipClass="tooltip-edit">
			<i class="fa fa-pen text-warning p-0"></i>
		</button>
		<button (click)="invokeParentMethod_delete()" class="btn btn-transparent px-2 py-0" matTooltip="Eliminar" matTooltipClass="tooltip-delete">
			<i class="fa fa-trash text-danger p-0"></i>
		</button>
	`,
	styles: [' .tooltip-edit { background: #ffb822; } ', ' .tooltip-delete { background: #fd397a; } '],
	encapsulation: ViewEncapsulation.None,
})
export class EditDeleteComponent implements ICellRendererAngularComp {
	public params!: ICellRendererParams;

	agInit(params: ICellRendererParams): void {
		this.params = params;
	}

	refresh(_: any): boolean {
		return false;
	}

	public invokeParentMethod_edit() {
		this.params.context.componentParent.methodFromParent_edit(`${this.params.node.rowIndex}`);
	}

	public invokeParentMethod_delete() {
		this.params.context.componentParent.methodFromParent_delete(`${this.params.node.rowIndex}`);
	}
}
