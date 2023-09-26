import { Component, OnInit, ViewChild,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { DataTable } from 'src/app/@utils/data-table/DataTable';
import { ColDef, ColumnApi, Grid, GridApi, RowNode } from 'ag-grid-community';
import { MatAccordion } from '@angular/material/expansion';
import { TbUsuarioService } from 'src/app/core/services';
import { TbPerfilDto, TbUsuarioDto } from 'src/app/shared/classes';
import { Observable, of } from 'rxjs';
import { TbPerfilService } from 'src/app/core/services/TbPerfilService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { convertObserverToPromise } from 'src/app/@utils/models/FormUtil';
import { Router } from '@angular/router';
import { DateFormatPipe } from 'src/app/@utils/date-util/DateFormatPipe';
import { ConfigButtonAction, ConfigButtonAgGrid, EnumButtonType } from 'src/app/@utils/models/sc-ag-grid.interface';
import { SearchUsuarioDto } from 'src/app/shared/classes-custom';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.scss'],
})
export class ListarUsuarioComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() value: any;

  open = false;
  data: any = [];
  isDisbledNroDni = true;
  isDisbledRangoFch = false;
  isDisbledNomAp = false;

  tbColumns: DataTable[] = [];
  columnDefs: ColDef[] = [];
  formGroup!: FormGroup;
  rowData$: Observable<TbUsuarioDto[]> = of([]);
  ngSelectperfil$: Observable<TbPerfilDto[]> = of([]);
  searchUsuarioDto!: SearchUsuarioDto;
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  configButtonsAction: ConfigButtonAction = {};

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  ngSelectTipoFiltro: Observable<{ label: string; value: string }[]> = of([
    { value: '01', label: '01 - RANGO DE FECHA' },
    { value: '02', label: '02 - NÚMERO DE DNI' },
    { value: '03', label: '03 - NOMBRE Y APELLIDO' },
  ]);

  constructor(
    public readonly tbUsuarioService: TbUsuarioService,
    public readonly tbPerfilService: TbPerfilService,
    public readonly _fb: FormBuilder,
    public readonly routers: Router,
    public _dateFormatPipe: DateFormatPipe,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.initForm();
  }

  ngAfterViewInit(): void {
    void this.search();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {

    this.onInitNgSelect();
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
  private readonly _agGridActions: ConfigButtonAgGrid[] = [
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
  initForm() {
    this.formGroup = this._fb.group({
      tipoFiltro: [null],
      codPerfil: [null],
      nroDni: [null],
      nombre: [null],
      apPaterno: [null],
      apMaterno: [null],
      fchInicio: [null],
      fchFin: [null],
    });
  }

  onGridReadyHeader(gridApi: GridApi, gridApiColumn: ColumnApi): void {
    this.gridApi = gridApi;
    this.gridColumnApi = gridApiColumn;
  }

  onInitNgSelect() {
    this.ngSelectperfil$ = this.tbPerfilService.getSelectList();
  }

  onButtonActionAgGrid(type: string, rowNode: RowNode): void {
    console.log("111111",{ type, rowNode });
    if (type == 'TYPE_EDIT') {
      this.routers.navigate([`./nav/usuario/registrar/`+`${rowNode.data.idUsuario+'-'+rowNode.data.codPerfil}`]);
    }
  }

  onChangeSelect(e: any) {
    this.clearValueForm();
    switch (e.value) {
      case '01':
        this.isDisbledNroDni = false;
       this.isDisbledRangoFch = true;
        this.isDisbledNomAp = false;
        this.formGroup.get('fchInicio')?.setValue(this._dateFormatPipe.getFirstDayOfMonth());
        this.formGroup.get('fchFin')?.setValue(this._dateFormatPipe.getLastDayOfMonth());
        this.formGroup.get('fchInicio')?.setValidators([Validators.required]);
        this.formGroup.get('fchFin')?.setValidators([Validators.required]);
        break;
      case '02':
        this.isDisbledNroDni = true;
        this.isDisbledRangoFch = false;
        this.isDisbledNomAp = false;
        this.formGroup.get('nroDni')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        break;
      default:
        this.isDisbledNroDni = false;
        this.isDisbledRangoFch = false;
        this.isDisbledNomAp = true;
        this.formGroup.get('nombre')?.setValidators([Validators.required]);
        this.formGroup.get('apMaterno')?.setValidators([Validators.required]);
        this.formGroup.get('apPaterno')?.setValidators([Validators.required]);
        break;
    }
  }

  clearValueForm() {
    const data = { nroDni: null, nombre: null, apPaterno: null, apMaterno: null, fchInicio: null, fchFin: null};
    this.formGroup.patchValue(data);
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.setErrors(null);
      this.formGroup.get(key)?.markAsUntouched();
    });
  }

  addRow() {
    return this.routers.navigate([`./nav/usuario/registrar/`+ `${0}`]);
  }

  isFirstEmit = true;
  async search(): Promise<void> {
    if (this.isFirstEmit) {
      try {
        await Promise.all(convertObserverToPromise(this.ngSelectperfil$));
        this.isFirstEmit = false;
      } catch {}
    }
    if (this.formGroup.valid) {
      //this.gridApi.showLoadingOverlay();
      const formValue = this.formGroup.getRawValue();
      let search = (this.searchUsuarioDto = {
        codPerfil: formValue.codPerfil != undefined ? formValue.codPerfil : '01',
        nroDni: formValue.nroDni,
        nombre: formValue.nombre,
        apPaterno: formValue.apPaterno,
        apMaterno: formValue.apMaterno,
        fchInicio: formValue.fchInicio ? this._dateFormatPipe.formatDate(formValue.fchInicio, 'yyyy-MM-dd') : null,
        fchFin: formValue.fchFin ? this._dateFormatPipe.formatDate(formValue.fchFin, 'yyyy-MM-dd') : null,
      });
      await this.tbUsuarioService.listUsuario(search).then((data:any) =>{
        this.gridApi?.setRowData(data);
      })
      /*this.tbUsuarioService.listUsuario(search)
        .pipe(
          tap((data) => {
            this.gridApi?.setRowData(data);
          })
        )
        .subscribe();*/
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
