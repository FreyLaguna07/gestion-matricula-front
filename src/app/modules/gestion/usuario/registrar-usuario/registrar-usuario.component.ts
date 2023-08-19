import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef, ColumnApi, GridApi, RowNode } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { DataDialog } from 'src/app/@utils/modal-crud-component/DataDialog';
import { TbApoderadoService, TbUsuarioService } from 'src/app/core/services';
import { TbPerfilService } from 'src/app/core/services/TbPerfilService.service';
import { SearchUsuarioDto, TbCursoDto, TbPerfilDto, TbUsuarioDto, TbUsuarioInsertOrUpdateDto } from 'src/app/shared/classes';
import { TbApoderadoDto } from 'src/app/shared/classes/TbApoderadoDto';
import { OpenModalComponent } from 'src/app/shared/models/components/open-modal-component/open-modal-component';
import { ConfigButtonAction, ConfigButtonAgGrid, EnumButtonType } from 'src/app/@utils/models/sc-ag-grid.interface';
import { TbCursoService } from 'src/app/core/services/TbCursoService.service';
import { ModalRegistrarCursoComponent } from '../common/modal-registrar-curso/modal-registrar-curso.component';
import { ModalRegistrarApoderadoComponent } from '../common/modal-registrar-apoderado/modal-registrar-apoderado.component';
import { EnumTipoOperador } from 'src/app/shared/enum/EnumTipoOperador';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Loading } from 'src/app/@utils/models/Loading';
import { MessageUtilService } from 'src/app/@utils/models/message-util.service';
import { DateFormatPipe } from 'src/app/@utils/date-util/DateFormatPipe';



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

  archivos:any = [];
  idCrud!: any;
  perfil: any;
  tTbUsuarioInsertOrUpdateDto!: TbUsuarioInsertOrUpdateDto;
  loading = new Loading();


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
    private readonly tbUsuarioService: TbUsuarioService,
    private readonly messageUtilService: MessageUtilService,
    public _dateFormatPipe: DateFormatPipe,
  ) {
    super(matDialog, '650px');
    this.initForm();
    this.route.paramMap.subscribe((params: ParamMap) => {this.idCrud = params.get('id')});
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
    if(this.ngSelectperfil$){
      this.ngSelectperfil$.forEach((e) => {
        this.perfil = e;
      });
    }

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
    console.log("asdsadsad", this.formGroup.valid);
    //if(this.formGroup.valid){
console.log("this.idCrud",this.idCrud);
      if(this.idCrud != "0"){
        this.update();
      }else{
        this.insert();
      }
    //}else{
    //  this.formGroup.markAllAsTouched();
//}
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

  insert(): void {
    this.loading.showSmall('Guardando...');
    this.tTbUsuarioInsertOrUpdateDto = this.setResourceToSave("R");
    this.tbUsuarioService.insert(this.tTbUsuarioInsertOrUpdateDto).subscribe((res)=>{
      if (res !== null && res.codError === 1) {
        this.loading.hide();
        this.messageUtilService.getMessageSuccess("Registro exitoso", "El usuario se registró correctamente.");
      }else{
        this.loading.hide();
        this.messageUtilService.getMessageInfo("Ya existe un registro con el DNI ");
      }
    }, err => this.loading.hide());
  }

  update(): void {
    this.loading.showSmall('Actualizando...');
    this.tTbUsuarioInsertOrUpdateDto = this.setResourceToSave("E");
    this.tbUsuarioService.update(this.tTbUsuarioInsertOrUpdateDto ).subscribe(res => {
      if (res !== null && res.codError === 1) {
        this.loading.hide();
        this.messageUtilService.getMessageSuccess("Actualización exitosa", "El usuario se actualizó correctamente.");
      }
    }, err => this.loading.hide());
  }
  setResourceToSave(accion: string): TbUsuarioInsertOrUpdateDto {
    const valueForm = this.formGroup.getRawValue();
    const tTbUsuarioInsertOrUpdateDto: TbUsuarioInsertOrUpdateDto = {};
    const tipoOperador = EnumTipoOperador.TIPO_OPERADOR.find((e:any) => {
      return e.value == valueForm.codOperador ? null : e;
    });
     const getValuePerfil = this.perfil.find((e: any) => {
        return e.value == valueForm.codOperador ? null : e;
      });
    if (Number(this.idCrud) != 0 && accion == "E") {
      tTbUsuarioInsertOrUpdateDto.idUsuario = +this.idCrud;
    }
    tTbUsuarioInsertOrUpdateDto.codPerfil = valueForm.codPerfil;
    tTbUsuarioInsertOrUpdateDto.idPerfil = getValuePerfil.idPerfil;
    tTbUsuarioInsertOrUpdateDto.nombre = valueForm.nombre;
    tTbUsuarioInsertOrUpdateDto.apPaterno = valueForm.apPaterno;
    tTbUsuarioInsertOrUpdateDto.apMaterno  = valueForm.apMaterno;
    tTbUsuarioInsertOrUpdateDto.nroDni  = valueForm.nroDni;
    tTbUsuarioInsertOrUpdateDto.fchNacimiento  = this._dateFormatPipe.formatDate(valueForm.fchNacimiento, 'yyyy-MM-dd');
    tTbUsuarioInsertOrUpdateDto.sexo  = valueForm.sexo;
    tTbUsuarioInsertOrUpdateDto.idApoderado  = null;
    tTbUsuarioInsertOrUpdateDto.nroTelefono = valueForm.nroTelefono;
    tTbUsuarioInsertOrUpdateDto.tipoOperador  = tipoOperador?.label.split("-")[1];
    tTbUsuarioInsertOrUpdateDto.codOperador  = valueForm.tipoOperador;
    tTbUsuarioInsertOrUpdateDto.correo  = valueForm.correo;
    tTbUsuarioInsertOrUpdateDto.copiDni  = this.archivos.copiDni as string;
    tTbUsuarioInsertOrUpdateDto.copiPartidaNacimiento  = valueForm.copiPartidaNacimiento;
    tTbUsuarioInsertOrUpdateDto.foto  = valueForm.foto;
    tTbUsuarioInsertOrUpdateDto.idContacto  = valueForm.idContacto;
    tTbUsuarioInsertOrUpdateDto.idDetalle  = valueForm.idDetalle;
    tTbUsuarioInsertOrUpdateDto.direccion  = valueForm.direccion;
    tTbUsuarioInsertOrUpdateDto.idCurso  = null;
    return {...tTbUsuarioInsertOrUpdateDto};
  }

}
