import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { RegistrarAlumnoComponent } from '../registrar-alumno/registrar-alumno.component';
import { MatDialog } from '@angular/material/dialog';
import { DataTable } from 'src/app/shared/classes/data-table/DataTable';
import { ColDef } from 'ag-grid-community';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-listar-alumno',
  templateUrl: './listar-alumno.component.html',
  styleUrls: ['./listar-alumno.component.scss']
})
export class ListarAlumnoComponent implements OnInit {
  open = false;
  data:any=[];
  tbColumns: DataTable[]=[];
  columnDefsAdmin: ColDef[] = [];
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    protected dialog: MatDialog | null,

  ) { }

  ngOnInit() {
    this.setData();

    this.columnDefsAdmin = [
      {
        headerName: 'Marca',
        field: 'make',
        width: 150,
        headerClass: 'text-center',
        cellClass: 'text-center',
        resizable: false,
        pinned: 'left',
        suppressMenu: true,
        lockPosition: true,
        sort: 'asc'
      },
      {
        headerName: 'model',
        field: 'model',
        width: 300
      },
      {
        headerName: 'price',
        field: 'price',
        width: 300
      },
      {
        headerName: 'Estado',
        width: 110,
        valueGetter(params) { return params.data.estado ? 'Activo' : 'Inactivo'; }
      }
    ];
  }
  setData(){
    this.data={title:"hola"}
  }

  columnDefs: ColDef[] = [
		{ headerName: 'Make', field: 'make' },
		{ headerName: 'Model', field: 'model' },
		{ headerName: 'Price', field: 'price' },
    { headerName: 'Price', field: 'estado' }
	];

	rowData = [
		{ make: 'Toyota', model: 'Celica', price: 35000, estado:1 },
		{ make: 'Ford', model: 'Mondeo', price: 32000 ,estado:0 },
		{ make: 'Porsche', model: 'Boxster', price: 72000 ,estado:0}

	];


  router(){
    return RegistrarAlumnoComponent;
  }

  onReady(e:any){
    this.columnDefsAdmin = [
      {
        headerName: 'Código',
        field: 'codigo',
        width: 150,
        headerClass: 'text-center',
        cellClass: 'text-center',
        resizable: false,
        pinned: 'left',
        suppressMenu: true,
        lockPosition: true,
        sort: 'asc'
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 300
      },]
    console.log("event",e);
  }



  openDialog(resource?: any) {
    let subtitle: string = '';
    let type: string = '';
    let idCrud: number | null = null;
    if (resource === undefined) {
        subtitle = 'Registro';
        type = 'R';
    } else if (resource !== null) {
        subtitle = 'Edición';
        type = 'E';
        //idCrud = this.getId(resource) || null;
    }
    this.dialog?.open(this.router(), {
        width: '550px',
        disableClose: true,
        data: {
            subtitle: subtitle,
            type: type,
            idCrud: idCrud
        }
    }).afterClosed().subscribe(response => {
      console.log("aquiii");
       // if (response) { this.genericList(); }
    });
}
}
