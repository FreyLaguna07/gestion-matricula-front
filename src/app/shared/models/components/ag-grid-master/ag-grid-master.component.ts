import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DataTable } from 'src/app/shared/classes/data-table/DataTable';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-ag-grid-master',
  templateUrl: './ag-grid-master.component.html',
  styleUrls: ['./ag-grid-master.component.scss']
})
export class AgGridMasterComponent implements OnInit {

  @Input() rowData: any[]= [];
	@Input() columnDefs: any[] = [];

  columnDefsActions:any[]= [];

  @Output() methodName = new EventEmitter<boolean>();

  /*@Input() set columnDefs(tableColumns: any){
    console.log("tableColumns",this.columnDefs);
  } ;
  @Input() set rowData(data:any[]){
    console.log("dataTable",data);
  } ;*/

  title = 'app';




  constructor() { }

  ngOnInit() {
    console.log(this.rowData);
    console.log(this.columnDefs);
    this.columnDefsActions = this.columnDefs.concat(this.createColumnDefsActions());
  }
  private createColumnDefsActions(): any[] {
		return [
			{
				headerName: 'Acciones',
				field: '',
				width: 100,
				minWidth: 100,
				headerClass: 'text-center',
				cellStyle: { overflow: 'visible', display: 'flex', 'justify-content': 'center', 'align-items': 'center' },
				resizable: false,
				sortable: false,
				cellRenderer: 'buttonsGridAdminComponent',
				cellRendererParams: { },
				pinned: 'right',
				suppressMenu: true,
				filter: false,
				lockPosition: true
			}
		];
	}

}
