import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
	selector: 'checkbox-list',
	template: `
		<div>
			<ul>
				<ng-container *ngIf="params.value as items">
					<li *ngFor="let item of items">
						<ng-container *ngIf="item">
							<mat-checkbox [ngClass]="{ 'checkbox-list-disabled': item.disabled }" color="primary" (change)="showOptions($event, item)" [(ngModel)]="item.checked" [disabled]="item.disabled">{{
								item.label || ''
							}}</mat-checkbox>
						</ng-container>
					</li>
				</ng-container>
			</ul>
		</div>
	`,
	styles: [
		`
			ul {
				list-style-type: none;
				margin-top: 1.5px;
				padding-left: 0px;
			}
		`,
	],
})
export class CheckboxListComponent implements ICellRendererAngularComp {
	public params!: ICellRendererParams;

	agInit(params: ICellRendererParams): void {
		this.params = params;
	}

	refresh(params: any): boolean {
		return false;
	}

	showOptions(evt: any, item: any): void {
		if (
			this.params.api
				.getSelectedNodes()
				.map((e) => e.data)
				.findIndex((x) => x.idUnique === item.idUnique) === -1
		) {
			evt.source.checked = false;
			item.checked = false;
		}
	}
}
