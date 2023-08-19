import { Component, ViewEncapsulation } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'edit-button',
	template: `
		<div class="d-flex justify-content-center">
			<button (click)="invokeParentMethod_edit()" type="button" class="btn btn-transparent px-2 py-0" matTooltip="Modificar" matTooltipClass="tooltip-edit">
				<i class="fa fa-pen text-warning p-0"></i>
			</button>
			<button (click)="invokeParentMethod_delete()" type="button" class="btn btn-transparent px-2 py-0" matTooltip="Eliminar" matTooltipClass="tooltip-delete">
				<i class="fa fa-trash text-danger p-0"></i>
			</button>
		</div>
	`,
	styles: [' .tooltip-edit { background: #ffb822; } ', ' .tooltip-delete { background: #fd397a; } '],
	encapsulation: ViewEncapsulation.None,
})
export class EditButtonComponent implements ICellRendererAngularComp {
	public params: any;

	agInit(params: any): void {
		this.params = params;
	}

	public invokeParentMethod_edit() {
		this.params.context.componentParent.methodFromParent_edit(`${this.params.node.rowIndex}`);
	}

	public invokeParentMethod_delete() {
		this.params.context.componentParent.methodFromParent_delete(`${this.params.node.rowIndex}`);
	}

	public accionTabla() {
		this.params.context.componentParent.methodFromParent_accion(`${this.params.node.rowIndex}`);
	}

	refresh(): boolean {
		return false;
	}
}
// <div class="input-group">
// 					<div class="input-group-prepend">
// 					  <button class="btn btn-outline-secondary dropdown-toggle" type="button"
// 							data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-ellipsis-v text-primary p-0" ></i></button>
// 						<div class="dropdown-menu">
// 									<a class="dropdown-item" href="#">Acción 1</a>
// 									<a class="dropdown-item" href="#">Acción 2</a>
// 									<a class="dropdown-item" href="#">Acción 3</a>
// 									<div role="separator" class="dropdown-divider"></div>
// 									<a class="dropdown-item" href="#">Acción 4</a>
// 						</div>
// 					</div>
//         </div>
