import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef, ColumnApi, GridApi, RowNode } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { DataDialog } from 'src/app/@utils/modal-crud-component/DataDialog';
import { TbApoderadoService } from 'src/app/core/services';
import { TbPerfilService } from 'src/app/core/services/TbPerfilService.service';
import { SearchUsuarioDto, TbCursoDto, TbPerfilDto, TbUsuarioDto } from 'src/app/shared/classes';
import { TbApoderadoDto } from 'src/app/shared/classes/TbApoderadoDto';
import { OpenModalComponent } from 'src/app/shared/models/components/open-modal-component/open-modal-component';
import { ConfigButtonAction, ConfigButtonAgGrid, EnumButtonType } from 'src/app/@utils/models/sc-ag-grid.interface';
import { TbCursoService } from 'src/app/core/services/TbCursoService.service';
import { ModalRegistrarCursoComponent } from '../common/modal-registrar-curso/modal-registrar-curso.component';
import { ModalRegistrarApoderadoComponent } from '../common/modal-registrar-apoderado copy/modal-registrar-apoderado.component';
import { EnumTipoOperador } from 'src/app/shared/enum/EnumTipoOperador';
import { ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
})
export class RegistrarUsuarioComponent
  extends OpenModalComponent<TbApoderadoDto>
  implements OnInit
{
  formGroup!: FormGroup;

  ngSelectperfil$: Observable<TbPerfilDto[]> = of([]);
  apoderadoDto$: Observable<TbApoderadoDto[]> = of([]);
  cursoDto$: Observable<TbCursoDto[]> = of([]);
  columnDefsApoderado: ColDef[] = [];
  columnDefsCurso: ColDef[] = [];
  searchUsuarioDto!: SearchUsuarioDto;
  configButtonsAction: ConfigButtonAction = {};

  gridApiApoderado!: GridApi;
  gridColumnApiApoderado!: ColumnApi;
  gridApiCurso!: GridApi;
  gridColumnApiCurso!: ColumnApi;

  isExpanded = false;
  isAlumno = false;

  archivos:any;
  idCrud!: any;

  ngSelectTipoOperador: Observable<{ label: string; value: string }[]> = of(
    EnumTipoOperador.TIPO_OPERADOR
  );

  ngSelectSexo: Observable<{ label: string; value: string }[]> = of([
    { value: 'M', label: 'M - MASCULINO' },
    { value: 'F', label: 'F - FEMENINO' },
  ]);

  constructor(
    public readonly _fb: FormBuilder,
    public readonly tbPerfilService: TbPerfilService,
    public readonly tbApoderadoService: TbApoderadoService,
    protected matDialog: MatDialog,
    public readonly tbCursoService: TbCursoService,
    private route: ActivatedRoute,
  ) {
    super(matDialog, '650px');
    this.initForm();
    this.idCrud = this.route.paramMap.subscribe((params: ParamMap) => {return params.get('id')});
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
  ];

  ngOnInit() {
    this.setData();
    this.initColumn();
    this.configButtonsAction = {
      agGrid: {
        actions: [...this._agGridActions],
      },
    };
  }

  setData() {
    this.ngSelectperfil$ = this.tbPerfilService.getSelectList();
    /*this.apoderadoDto$ = this.tbApoderadoService.listApoderado(
      (this.searchUsuarioDto = new SearchUsuarioDto())
    );
    this.cursoDto$ = this.tbCursoService.listCurso();*/
  }

  initForm() {
    this.formGroup = this._fb.group({
      codPerfil: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      apPaterno: [null, [Validators.required]],
      apMaterno: [null, [Validators.required]],
      nroDni: [
        null,
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      fchNacimiento: [null, [Validators.required]],
      sexo: [null, [Validators.required]],
      direccion: [null],
      nroTelefono: [
        null,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      tipoOperador: [null, [Validators.required]],
      codOperador: [null, [Validators.required]],
      correo: [null, [Validators.required, Validators.email]],
      copiDni: [null, [Validators.required]],
      copiPartidaNacimiento: [null],
      foto: [null],
      certEstudio: [null],
    });
  }

  initColumn() {
    this.columnDefsApoderado = [
      {
        headerName: '',
        field: 'idApoderado',
        maxWidth: 40,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        lockPosition: true,
        pinned: 'left',
        cellStyle: { display: 'flex', 'align-items': 'center' },
      },
      {
        headerName: 'Nombres',
        field: 'nombre',
        width: 150,
      },
      {
        headerName: 'Ap. Paterno',
        field: 'apPaterno',
        width: 150,
        sort: 'asc',
      },
      {
        headerName: 'Ap. Materno',
        field: 'apMaterno',
        width: 150,
      },
      {
        headerName: 'Nro. DNI',
        field: 'nroDni',
        width: 150,
      },
      {
        headerName: 'Nro. Celular',
        field: 'nroTelefono',
        width: 150,
      },
      {
        headerName: 'Tipo operador',
        field: 'codOperador',
        valueGetter(params) {
          let tipoOperador = '';
          if (params.data.codOperador == 'M') {
            tipoOperador = 'Movistar';
          } else if (params.data.codOperador == 'C') {
            tipoOperador = 'Claro';
          } else if (params.data.codOperador == 'B') {
            tipoOperador = 'Bitel';
          } else if (params.data.codOperador == 'E') {
            tipoOperador = 'Entel';
          }
          return tipoOperador;
        },
        width: 150,
      },
    ];

    this.columnDefsCurso = [
      {
        headerName: '',
        field: 'idCurso',
        maxWidth: 40,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        lockPosition: true,
        pinned: 'left',
        cellStyle: { display: 'flex', 'align-items': 'center' },
      },

      {
        headerName: 'Cod. Curso',
        field: 'codCurso',
        width: 150,
        sort: 'asc',
      },
      {
        headerName: 'Curso',
        field: 'nombre',
        width: 150,
      },
      {
        headerName: 'Horas',
        field: 'horas',
        width: 150,
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 150,
      },
      {
        headerName: 'Estado',
        field: 'estado',
        valueGetter(params) {
          return params.data.estado ? 'Activo' : 'Inactivo';
        },
        width: 150,
      },
    ];
  }

  getRegisterComponent() {
    if (this.isAlumno) {
      return ModalRegistrarApoderadoComponent;
    } else {
      return ModalRegistrarCursoComponent;
    }
  }

  getId(resource: any): number {
    if (this.isAlumno) {
      return resource.data.idApoderado!;
    } else {
      return resource.data.idCurso!;
    }
  }

  onButtonActionAgGrid(type: string, rowNode: any): void {
    this.genericEdit(rowNode);
    console.log('111111', { type, rowNode });
  }

  onChangePerfil(e: any): void {
    this.onClearValueForm();
    this.isAlumno = false;
    switch (e.value) {
      case '01':
        this.isExpanded = false;
        break;
      case '02':
        this.cursoDto$ = this.tbCursoService.listCurso(0);
        this.isExpanded = true;
        this.isAlumno = false;
        break;
      default:
        this.apoderadoDto$ = this.tbApoderadoService.listApoderado(
          (this.searchUsuarioDto = new SearchUsuarioDto())
        );
        this.formGroup
          .get('copiPartidaNacimiento')
          ?.setValidators([Validators.required]);
        this.formGroup.get('foto')?.setValidators([Validators.required]);
        this.formGroup.get('certEstudio')?.setValidators([Validators.required]);
        this.isExpanded = true;
        this.isAlumno = true;
        break;
    }
  }

  onClearValueForm(): void {
    const data = { copiPartidaNacimiento: null, foto: null, certEstudio: null };
    this.formGroup.patchValue(data);
    Object.keys(this.formGroup.controls).forEach((key) => {
      if(key == 'certEstudio' || key == 'foto' || key == 'certEstudio'){
        console.log("key", key);
        this.formGroup.get(key)?.setErrors(null);
        this.formGroup.get(key)?.markAsUntouched();
      }
    });
  }

  onGridReadyApoderado(gridApi: GridApi, gridApiColumn: ColumnApi): void {
    this.gridApiApoderado = gridApi;
    this.gridColumnApiApoderado = gridApiColumn;
  }
  onGridReadyCurso(gridApi: GridApi, gridApiColumn: ColumnApi): void {
    this.gridApiCurso = gridApi;
    this.gridColumnApiCurso = gridApiColumn;
  }

  setCloseDialog(boolean: boolean): void {
    if (boolean) {
      if (this.isAlumno) {
        this.gridApiApoderado.setRowData([]);
        this.apoderadoDto$ = this.tbApoderadoService.listApoderado(
          (this.searchUsuarioDto = new SearchUsuarioDto())
        );
      } else {
        this.gridApiCurso.setRowData([]);
        this.cursoDto$ = this.tbCursoService.listCurso(0);
      }
    }
  }
  onSave(): void {

    if(this.formGroup.valid){
      if(Number(this.idCrud) != 0 ){
        this.update();
      }else{
        this.insert();
      }
    }else{
      this.formGroup.markAllAsTouched();
    }
    console.log(this.formGroup.getRawValue());
  }

  cargarpdf(element: any, index: number) {
    const file: File = element.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log("documento PDF",reader.result);
      if (index == 1) {
        this.archivos.copiDni = String(reader.result);
      } else if (index == 2) {
        this.archivos.copiPartidaNacimiento = String(reader.result);
      } else if (index == 3) {
        this.archivos.foto = String(reader.result);
      } else if (index == 4) {
        this.archivos.certEstudio = String(reader.result);
      }

    };
  }

  insert(): void {}
  update(): void {

  }
  setResourceToSave(accion: string): void {
    const valueForm = this.formGroup.getRawValue();
    const tbUsuarioDto: TbUsuarioDto = {};

    if (Number(this.idCrud) != 0) {
      tbUsuarioDto.idUsuario = +this.idCrud;
    }
    tbUsuarioDto.codPerfil = valueForm.codPerfil;
    //tbUsuarioDto.idPerfil = valueForm.idPerfil;
    tbUsuarioDto.nomUsuario = valueForm.nomUsuario;
    tbUsuarioDto.apPaternoUsuario = valueForm.apPaterno;
    tbUsuarioDto.apMaternoUsuario  = valueForm.apMaterno;
    tbUsuarioDto.nroDniUsuario  = valueForm.nroDni;
    tbUsuarioDto.fchNacimeintoUsuario  = valueForm.fchNacimiento;
    tbUsuarioDto.sexo  = valueForm.sexo;
    tbUsuarioDto.direccion  = valueForm.direccion;
    /*tbUsuarioDto.  = valueForm.nroTelefono;
    tbUsuarioDto.  = valueForm.tipoOperador;
    tbUsuarioDto.  = valueForm.codOperador;
    tbUsuarioDto.  = valueForm.correo;
    tbUsuarioDto.  = valueForm.copiDni;
    tbUsuarioDto.  = valueForm.copiPartidaNacimiento;
    tbUsuarioDto.  = valueForm.foto;
    tbUsuarioDto.  = valueForm.certEstudio;*/
  }
}
