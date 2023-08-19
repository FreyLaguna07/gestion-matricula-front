import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subscription, of } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ColDef, ColumnApi, DomLayoutType, GridApi, GridReadyEvent, RowNode, SelectionChangedEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CheckboxListComponent } from '../ag-grid-render/checkbox-list.component';
//import { ScAgGridPaginationComponent } from '../sc-ag-grid/sc-ag-grid-pagination/sc-ag-grid-pagination.component';

import { EnumButtonType, ButtonHeader, ConfigButtonAction, ConfigButtonAgGrid } from 'src/app/@utils/models/sc-ag-grid.interface';
import { CellRendererButtonComponent } from '../renderable-cells/actions/cell-render-button/cell-render-button.component';
import { ScButton } from '../sc-button/sc-button.component';
import { ScAgGridButtonHeader } from '../../directives/scAgGrid.directive';
import { isObjEmpty } from 'src/app/@utils/models/FormUtil';
import { EditDeleteComponent } from '../ag-grid-render/edit-delete.component';

@Component({
	selector: 'ag-grid-customizable',
	templateUrl: './ag-grid-customizable.component.html',
	styleUrls: ['./ag-grid-customizable.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
@AutoUnsubscribe()
export class AgGridCustomizableComponent implements OnInit, OnDestroy, OnChanges {
	@ContentChildren(ScAgGridButtonHeader, { descendants: true })
	scAgGridButtonHeaderChildren!: QueryList<ScAgGridButtonHeader>;

	@ViewChild('agGrid') agGrid?: AgGridAngular;
	//@ViewChild('scAgGridPagination') scAgGridPagination?: ScAgGridPaginationComponent;

	@ViewChild('buttonAdd') buttonAdd?: ScButton;
	@ViewChild('buttonExport') buttonExport?: ScButton;
	@ViewChild('buttonImport') buttonImport?: ScButton;

	@Input() menuActions = true;
	@Input() rowData: Observable<any[]> = of([]);
	@Input() columnDefs: ColDef[] = [];
	@Input() cellRendererAction = 'cellRendererButtonComponent';

	@Input() paginationPageSize = 15;
	@Input() pagination = true;

	@Input() rowSelection = 'multiple';
	@Input() visibleSearch = true;
  @Input() sizeHeight = '150px';

	@Output() onGridChange: EventEmitter<[GridApi, ColumnApi]> = new EventEmitter();
	@Output() onGridReady = new EventEmitter<[GridApi, ColumnApi]>();
	@Output() onSelectionChange = new EventEmitter<any[]>();

	@Input() btnAdd: ButtonHeader = { visible: true };
	@Input() btnImport: ButtonHeader = { visible: false };
	@Input() btnExport: ButtonHeader = { visible: false };

	@Output() onAddRow = new EventEmitter<GridApi>();
	@Output() onImport = new EventEmitter<any[]>();
	@Output() onExport = new EventEmitter<any[]>();

	@Output() onEditRow = new EventEmitter<RowNode>();
	@Output() onDeleteRow = new EventEmitter<[GridApi, any[]]>();

	@Output() onButtonActionAgGrid = new EventEmitter<[EnumButtonType | string, RowNode]>();

	//eliminar
	@Output() onButtonHeader = new EventEmitter<EnumButtonType | string>();

	// rowDataSubscription: Subscription;
	_selectedData: any[] = [];

	_formControlSearch = new FormControl('');
	_subscription$ = new Subscription();
	_subscriptionRowData$!: Subscription;

	_gridApi!: GridApi;
	_gridColumnApi!: ColumnApi;

	_columnDefsActions: ColDef[] = [];
	_defaultColDef: ColDef = {
		flex: 1,
		resizable: true,
		sortable: true,
		autoHeight: true,
	};
	get _style() {
		return {
			width: '100%',
			height: '100%',
			flex: '1 1 auto',
		};
	}
	_domLayout: DomLayoutType = 'autoHeight';

	_frameworkComponents = {
    editDeleteComponent: EditDeleteComponent,
		cellRendererButtonComponent: CellRendererButtonComponent,
		checkboxListComponent: CheckboxListComponent,
	};
	_context = { componentParent: this };

	_overlayNoRowsTemplate = `<span class="ag-overlay-loading-center border-0 bg-transparent shadow-none">
			No se encontraron registros...
		</span>`;
	_overlayLoadingTemplate = `<span class="ag-overlay-loading-top d-flex align-items-center border-0 bg-white shadow p-4 text-info" style="height: 20px;">
			<img src="assets/loading.gif" height="20" width="25" class="mr-2">
			<strong>Cargando registros</strong>
		</span>
		`;

	_enumButtonType = {
		TYPE_ADD: EnumButtonType.TYPE_ADD,
	};

	_progressVisibled = false;

	@Input() configButtonsAction!: ConfigButtonAction;

	_configButtonsDefaultAgGrid: ConfigButtonAgGrid[] = [
		{
			actionCode: EnumButtonType.TYPE_EDIT,
			tooltipOption: {
				label: 'Modificar',
				classList: 'bg-warning',
			},
			iconOption: {
				icon: 'fa fa-pencil',
				classList: 'text-warning',
			},
		},
		{
			actionCode: EnumButtonType.TYPE_DELETE,
			tooltipOption: {
				label: 'Eliminar',
				classList: 'bg-danger',
			},
			iconOption: {
				icon: 'fa fa-trash',
				classList: 'text-danger',
			},
		},
	];

	//constructor(private readonly _exelUtilService: ExelUtilService, private readonly _changeRef: ChangeDetectorRef) {}
  constructor(private readonly _changeRef: ChangeDetectorRef) {}

	ngOnInit(): void {
		// Search - AgGrid
		this._subscription$.add(
			this._formControlSearch.valueChanges.pipe(debounceTime(350)).subscribe((data:any) => {
				this._gridApi.setQuickFilter(data);
			})
		);

		// Actions - AgGrid
		this.initActionButton();
	}

	ngOnChanges(changes: SimpleChanges): void {
    console.log("changes",changes);
		if (!this._gridApi) return;

		//if (changes.configButtonsAction) this.initActionButton();
    this.initActionButton();

    //if (changes.rowData) this.initRowData();
		this.initRowData();

	}

	initActionButton(): void {

		if (isObjEmpty(this.configButtonsAction)) return;

		const { agGrid } = this.configButtonsAction;

		if (agGrid && agGrid.actions.length > 0) {
			agGrid.defaultAction = agGrid.defaultAction ?? true;

			if (agGrid.defaultAction) {
				this._configButtonsDefaultAgGrid = [...this._configButtonsDefaultAgGrid, ...agGrid.actions];
			} else {
				this._configButtonsDefaultAgGrid = [...agGrid.actions];
			}
		}
	}

	initRowData(): void {
		if (this._subscriptionRowData$) {
			this._subscriptionRowData$.unsubscribe();
			this._gridApi.setRowData([]);
			this._gridApi.showLoadingOverlay();
		}

		this._subscriptionRowData$ = this.rowData.subscribe((data) => {
			this._gridApi.setRowData(data);
			this._gridApi.sizeColumnsToFit();

			this.autoSizeColumns();
		});
	}

	autoSizeColumns(): void {
		const colIds = this._gridColumnApi.getAllDisplayedColumns().map((column) => column.getColId());
		this._gridColumnApi.autoSizeColumns(colIds);
	}

	// AgGrid - Events
	onGridChangeEmit(): void {
		if (!this._gridApi) return;

		if (!this._gridApi.getDisplayedRowCount()) return;

		this.onGridChange.emit([this._gridApi, this._gridColumnApi]);
		this.autoSizeColumns();
	}

	onGridReadyEmit(event: GridReadyEvent): void {
		let cellRenderer = '';

		if (this.cellRendererAction == 'cellRendererButtonComponent') {
			cellRenderer = 'cellRendererButtonComponent';
		}

		const length = this._configButtonsDefaultAgGrid.length;
		let minWidth;

		if (length > 2) {
			minWidth = length * 20 + 22;
		} else {
			minWidth = length == 2 ? 104 : 94;
		}

		const newColumns: ColDef = {
			headerName: 'Acciones',
			headerClass: 'ag-header__center',
			field: '',
			width: minWidth,
			minWidth,
			maxWidth: minWidth,
			cellClass: ['d-flex', 'justify-content-center', 'align-items-center'],
			cellStyle: { overflow: 'visible'},
			resizable: false,
			sortable: false,
			cellRenderer: CellRendererButtonComponent,
			pinned: 'right',
			suppressMenu: true,
			lockPosition: true,
		};
		this._columnDefsActions = [...this.columnDefs, newColumns];

		this._gridApi = event.api;
		this._gridColumnApi = event.columnApi;

		this.initRowData();
		this.onGridReady.emit([this._gridApi, this._gridColumnApi]);
	}

	onSelectionChangedEmit(event: SelectionChangedEvent): void {
		this._selectedData = this._gridApi.getSelectedRows();
		this.onSelectionChange.emit(this._gridApi.getSelectedRows());
	}

	// Button header - events
	onAddRowEmit(): void {
		this.onAddRow.emit(this._gridApi);
	}

	onImportEmit(event: any): void {
		const file = <File>event.target.files[0];
		this._progressVisibled = true;

		/*this._exelUtilService.import(file).then((result) => {
			this._progressVisibled = false;

			if (!result.error) this.onImport.emit(result.data);

			this._changeRef.markForCheck();
		});*/
	}

	onExportEmit(): void {
		const items: any[] = [];
		this._gridApi.forEachNode((rowNode) => items.push(rowNode.data));
		this.onExport.emit(items);
	}

	// Button action - events
	onButtonActionAgGridEmit(rowIndex: number, typeButton: string) {
		const ROWNODE = this._gridApi.getDisplayedRowAtIndex(rowIndex);
		if (ROWNODE) {
      this.onButtonActionAgGrid.emit([typeButton, ROWNODE as RowNode]);
		}
	}

	// Pagination - events
	onPaginationChanged(): void {
		if (!this._gridApi) return;

		//this.scAgGridPagination?.onPaginationChanged();
	}

	ngOnDestroy(): void {
		this._subscription$.unsubscribe();
	}
}
