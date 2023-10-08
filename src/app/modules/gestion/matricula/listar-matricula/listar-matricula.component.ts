import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, GridApi, RowNode } from 'ag-grid-community';
import { Observable, of, tap } from 'rxjs';
import { DateFormatPipe } from 'src/app/@utils/date-util/DateFormatPipe';
import { convertObserverToPromise } from 'src/app/@utils/models/FormUtil';
import { ConfigButtonAction, ConfigButtonAgGrid, EnumButtonType } from 'src/app/@utils/models/sc-ag-grid.interface';
import { TbGradoService, TbUsuarioService } from 'src/app/core/services';
import { TbGradoDto, TbMatriculaDto, TbUsuarioDto } from 'src/app/shared/classes';
import { SearchUsuarioDto } from 'src/app/shared/classes-custom';
import { OpenModalComponent } from 'src/app/shared/models/components/open-modal-component/open-modal-component';
import { ReporteMatriculaComponent } from '../../common/reporte-matricula/reporte-matricula.component';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-listar-matricula',
  templateUrl: './listar-matricula.component.html',
  styleUrls: ['./listar-matricula.component.scss']
})
export class ListarMatriculaComponent implements OnInit, AfterViewChecked {

  formGroup!: FormGroup;
  ngSelectTipoFiltro$: Observable<{ label: string; value: string }[]> = of([
    { value: '01', label: '01 - GRADO Y SECCION' },
    { value: '02', label: '02 - NÚMERO DE DNI' },
    { value: '03', label: '03 - NOMBRE Y APELLIDO' },
  ]);

  ngSelectEstadoAlumno$: Observable<{ label: string; value: number }[]> = of([
    { value: 0, label: '01 - POR MATRICULAR' },
    { value: 1, label: '02 - MATRICULADO' },
  ]);

  ngSelectGrado$: Observable<TbGradoDto[]> = of([]);

  ngSelectSeccion$:Observable<{ label: string; value: string }[]> = of([
    { value: 'A', label: 'SA - SECCION A' },
    { value: 'B', label: 'SA - SECCION B' },
    { value: 'C', label: 'SC - SECCION C' },
  ]);

  ngSelectNivel$: Observable<{ label: string; value: string }[]> = of([
    { value: 'PRIMARIA', label: '01 - PRIMARIA' },
    { value: 'SECUNDARIA', label: '02 - SECUNDARIA' },
  ]);

  columnDefs: ColDef[] = [];
  rowData$: Observable<any[]> = of([]);
  configButtonsAction: ConfigButtonAction = {};
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;


  isHideRangoFch = false;
  isHideNroDni = true;
  isHideNomAp = false;
  isMatriculado = true;


  constructor(
    protected _fb: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public _dateFormatPipe: DateFormatPipe,
    protected router: Router,
    public readonly tbUsuarioService: TbUsuarioService,
    private readonly routers: Router,
    private readonly tbGradoService: TbGradoService,
    protected matDialog : MatDialog,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.onSearch();
    this.initColum();
  }

  private readonly _agGridActions: ConfigButtonAgGrid[] = [
    {
      actionCode: EnumButtonType.TYPE_MATRICULAR,
      tooltipOption: {
        label: 'Matricular',
        classList: 'bg-success',
      },
      iconOption: {
        icon: 'fa fa-address-card',
        classList: 'text-success',
      },
    },
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
    {
      actionCode: EnumButtonType.TYPE_VER_RD,
      tooltipOption: {
        label: 'Ver',
        classList: 'bg-primary',
      },
      iconOption: {
        icon: 'fa fa-eye',
        classList: 'text-primary',
      },
    },

  ];

  initColum(): void {
    this.columnDefs = [
      {
        headerName: 'Código y/o Nro DNI',
        field: 'nroDniUsuario',
        width: 140,
        headerClass: 'text-center',
        cellClass: 'text-center',
        resizable: false,
        pinned: 'left',
        suppressMenu: true,
        lockPosition: true,
        sort: 'asc',
      },
      {
        headerName: 'Tipo usuario',
        field: 'tipousuario',
        width: 130,
      },
      {
        headerName: 'Nombres',
        field: 'nomUsuario',
        width: 120,
      },
      {
        headerName: 'Ap. Paterno',
        field: 'apPaternoUsuario',
        width: 120,
      },
      {
        headerName: 'Ap. Materno',
        field: 'apMaternoUsuario',
        width: 120,
      },
      {
        headerName: 'Sexo',
        width: 120,
        valueGetter(params) {
          return params.data.sexo === 'M' ? 'Masculino' : 'Femenino';
        },
      },
      {
        headerName: 'Fch. Nacimineto',
        field: 'fchNacimeintoUsuario',
        width: 120,
      },
      {
        headerName: 'Dirección',
        field: 'direccion',
        width: 120,
      },
      {
        headerName: 'Correo',
        field: 'correo',
        width: 120,
      },
      {
        headerName: 'Nro. Celular',
        field: 'nroTelefono',
        width: 120,
      },
      {
        headerName: 'Operador',
        field: 'tipoOperador',
        width: 120,
      },
    ];
    this.configButtonsAction = {
      agGrid: {
        actions: [...this._agGridActions],
      },
    };
  }


  onChangeSelect(e:any): void {
    this.onClearValueForm(true);
    switch (e.value) {
      case '01':
        this.isHideRangoFch = true;
        this.isHideNroDni = false;
        this.isHideNomAp = false;
        break;
      case '02':
        this.isHideRangoFch = false;
        this.isHideNroDni = true;
        this.isHideNomAp = false;
        break;
      default:
        this.isHideRangoFch = false;
        this.isHideNroDni = false;
        this.isHideNomAp = true;
        break;
    }
  }

  onClearValueForm(value: boolean): void {
    if(value){
      const patchFormValue = {
        estadoAlumno: null,
        nroDni: null,
        nombre: null,
        apPaterno: null,
        apMaterno: null,
        seccion: null,
        grado: null,
        anio: null}
        this.formGroup.patchValue(patchFormValue);
    } else {
      const patchFormValue = {
        seccion: null,
        grado: null,
        anio: null}
        this.formGroup.patchValue(patchFormValue);
    }
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.setErrors(null);
      this.formGroup.get(key)?.markAsUntouched();
    });
  }

  onChangeSelectEstAlumno(e: any): void {
    this.onClearValueForm(false);
    switch (e.value) {
      case 0:
        this.isMatriculado = false;
        break;
      default:
        this.isMatriculado = true;
        this.formGroup.get('anio')?.setValue(this._dateFormatPipe.getYear());
        break;
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initForm(): void {
    this.formGroup = this._fb.group({
      estadoAlumno: [null],
      tipoFiltro: [null],
      nroDni: [null],
      nombre: [null],
      apPaterno: [null],
      apMaterno: [null],
      seccion: [null],
      grado: [null],
      anio: [this._dateFormatPipe.getYear()],
      nivelAcademico: [null]
    });
  }

  isFirstEmit = true;
  async onSearch(){
    if (this.isFirstEmit) {
        try {
          await Promise.all(convertObserverToPromise(this.ngSelectEstadoAlumno$));
          this.isFirstEmit = false;
        } catch {}
    }
    if (this.formGroup.valid) {
      const formValue = this.formGroup.getRawValue();
      const search: SearchUsuarioDto = {
        codPerfil: '03',
        estadoAlumno: formValue.estadoAlumno,
        nroDni: formValue.nroDni,
        nombre: formValue.nombre,
        apPaterno: formValue.apPaterno,
        apMaterno: formValue.apMaterno,
        seccion: formValue.seccion,
        idGrado: formValue.grado,
        anio: formValue.anio,
      }
      await this.tbUsuarioService.listAlumMatriula(search).then((data:any) =>{
        this.gridApi?.setRowData(data);
      })
    } else {
      this.formGroup.markAllAsTouched();
    }

  }

  onButtonActionAgGrid(type: string, rowNode: RowNode): void {
    console.log({type, rowNode});
    if (type === EnumButtonType.TYPE_EDIT) {
      this.routers.navigate([`./nav/matricula/registrar/`+`${rowNode.data.idUsuario+'-'+rowNode.data.codPerfil}`+'-'+`E`]);
    } else if(type === EnumButtonType.TYPE_MATRICULAR) {
      this.routers.navigate([`./nav/matricula/registrar/`+`${rowNode.data.idUsuario+'-'+rowNode.data.codPerfil}`+'-'+`R`]);
    } else if(type === EnumButtonType.TYPE_VER_RD) {
      this.openReportMatricula(rowNode);
    }
  //this.router.navigate(['./nav/matricula/registrar']);
  }

  openReportMatricula(rowNode: any): void {
    const data: any = [];
		data.data = rowNode.data;
		data.title = 'Routing Order';
		data.subTitle = 'Generar';
		this.matDialog.open(ReporteMatriculaComponent, {
			width: '1050px',
			height: '90vh',
			maxHeight: '90vh',
			data,
		});
  }

  onGridReadyHeader(gridApi: GridApi, gridApiColumn: ColumnApi): void {
    this.gridApi = gridApi;
    this.gridColumnApi = gridApiColumn;
  }

  onChangeNivelAcademico(e:any): void {
    this.ngSelectGrado$ = this.tbGradoService.getSelectList(e.value);
    if (e.value === 'PRIMARIA') {
      this.formGroup.get('grado')?.setValue(1);
    } else {
      this.formGroup.get('grado')?.setValue(7);
    }
  }
}
