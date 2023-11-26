import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ColDef, ColumnApi, GridApi, RowNode} from 'ag-grid-community';
import {Observable, Subscription, of} from 'rxjs';
import {TbApoderadoService, TbUsuarioService} from 'src/app/core/services';
import {TbPerfilService} from 'src/app/core/services/TbPerfilService.service';
import {
    TbCursoDto,
    TbPerfilDto,
    TbUsuarioDto,
    TbUsuarioInsertOrUpdateDto
} from 'src/app/shared/classes';
import {TbApoderadoDto} from 'src/app/shared/classes/TbApoderadoDto';
import {OpenModalComponent} from 'src/app/shared/models/components/open-modal-component/open-modal-component';
import {ConfigButtonAction, ConfigButtonAgGrid, EnumButtonType} from 'src/app/@utils/models/sc-ag-grid.interface';
import {TbCursoService} from 'src/app/core/services/TbCursoService.service';
import {ModalRegistrarCursoComponent} from '../common/modal-registrar-curso/modal-registrar-curso.component';
import {ModalRegistrarApoderadoComponent} from '../common/modal-registrar-apoderado/modal-registrar-apoderado.component';
import {EnumTipoOperador} from 'src/app/shared/enum/EnumTipoOperador';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Loading} from 'src/app/@utils/models/Loading';
import {MessageUtilService} from 'src/app/@utils/models/message-util.service';
import {DateFormatPipe} from 'src/app/@utils/date-util/DateFormatPipe';
import {toFile} from 'src/app/@utils/models/Base64Pdf';
import { convertObserverToPromise } from 'src/app/@utils/models/FormUtil';
import { SearchCurso, SearchUsuarioDto } from 'src/app/shared/classes-custom';

@Component({selector: 'app-registrar-usuario',
templateUrl: './registrar-usuario.component.html',
styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent extends OpenModalComponent < TbApoderadoDto > implements OnInit,OnDestroy {
  formGroup !: FormGroup;

  ngSelectperfil$ : Observable < TbPerfilDto[] > = of([]);
  apoderadoDto$ : Observable < TbApoderadoDto[] > = of([]);
  cursoDto$ : Observable < TbCursoDto[] > = of([]);
  columnDefsApoderado : ColDef[] = [];
  columnDefsCurso : ColDef[] = [];
  searchUsuarioDto !: SearchUsuarioDto;
  configButtonsAction : ConfigButtonAction = {};
  subscription$ : Subscription[] = [];

  gridApiApoderado !: GridApi;
  gridColumnApiApoderado !: ColumnApi;
  gridApiCurso !: GridApi;
  gridColumnApiCurso !: ColumnApi;

  isSelect = 0;
  isAlumno = false;
  isDocente = false;

  archivos : any = [];
  idCrud !: any;
  perfil : any;
  tTbUsuarioInsertOrUpdateDto !: TbUsuarioInsertOrUpdateDto;
  loading = new Loading();
  respListUpdate !: TbUsuarioDto[];

  ngSelectTipoOperador : Observable < {label: string; value: string;}[] > = of(EnumTipoOperador.TIPO_OPERADOR);

  ngSelectSexo : Observable < {label: string; value: string;}[] > = of([
      {
          value: 'M',
          label: 'M - MASCULINO'
      }, {
          value: 'F',
          label: 'F - FEMENINO'
      },
  ]);

  heightDialog = '350px'

  constructor(
    public readonly _fb : FormBuilder,
    public readonly tbPerfilService : TbPerfilService,
    public readonly tbApoderadoService : TbApoderadoService,
    protected matDialog : MatDialog,
    public readonly tbCursoService : TbCursoService,
    private route : ActivatedRoute,
    private readonly tbUsuarioService : TbUsuarioService,
    private readonly messageUtilService : MessageUtilService,
    public _dateFormatPipe : DateFormatPipe,
    public readonly router: Router,
  ) {

      super(matDialog, '750px', null);
      this.initForm();
      this.route.paramMap.subscribe((params : ParamMap) => {
          this.idCrud = params.get('id');
      });
  }

  private readonly _agGridActions : ConfigButtonAgGrid[] = [
      {
          actionCode: EnumButtonType.TYPE_EDIT,
          tooltipOption: {
              label: 'Modificar',
              classList: 'bg-warning'
          },
          iconOption: {
              icon: 'fa fa-pencil',
              classList: 'text-warning'
          }
      }, {
          actionCode: EnumButtonType.TYPE_DELETE,
          tooltipOption: {
              label: 'Eliminar',
              classList: 'bg-danger'
          },
          iconOption: {
              icon: 'fa fa-trash',
              classList: 'text-danger'
          }
      },
  ];

  ngOnInit() {
      this.setData();
      this.initColumn();
      if (this.idCrud != 0)
          this.fillForm();
      this.configButtonsAction = {
          agGrid: {
              actions: [...this._agGridActions]
          }
      };
  }

  setData() {
      this.ngSelectperfil$ = this.tbPerfilService.getSelectList();
      if (this.ngSelectperfil$) {
          this.ngSelectperfil$.forEach((e) => {
              this.perfil = e;
          });
      }
  }

  initForm() {
      this.formGroup = this._fb.group({
          codPerfil: [null,[Validators.required]],
          nombre: [null,[Validators.required]],
          apPaterno: [null,[Validators.required]],
          apMaterno: [null,[Validators.required]],
          nroDni: [null,[Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
          fchNacimiento: [null,[Validators.required]],
          sexo: [null,[Validators.required]],
          direccion: [null,[Validators.required]],
          nroTelefono: [null,[Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
          codOperador: [null,[Validators.required]],
          correo: [null,[Validators.required, Validators.email]],
          copiDni: [null,[Validators.required]],
          copiPartidaNacimiento: [null],
          foto: [null],
          certEstudio: [null]
      });
  }

  async fillForm(): Promise < void > {
      const tipoUsuario: any = {
          value: this.idCrud.split('-')[1]
      };
      const tbUsuarioDto: TbUsuarioDto = {
          idUsuario: this.idCrud.split('-')[0],
          codPerfil: this.idCrud.split('-')[1]
      };
      this.formGroup.get('codPerfil') ?. disable();
      // this.subscription$.push(
        await this.tbUsuarioService.listUsuario(tbUsuarioDto).then((data:any) =>{
        console.log("data",data);
        if (data != null) {
          this.respListUpdate = data;
          this.formGroup.get('codPerfil') ?. setValue(data[0] ?. codPerfil);
          this.formGroup.get('nombre') ?. setValue(data[0] ?. nomUsuario);
          this.formGroup.get('apPaterno') ?. setValue(data[0] ?. apPaternoUsuario);
          this.formGroup.get('apMaterno') ?. setValue(data[0] ?. apMaternoUsuario);
          this.formGroup.get('nroDni') ?. setValue(data[0] ?. nroDniUsuario);
          this.formGroup.get('fchNacimiento') ?. setValue(data[0] ?. fchNacimeintoUsuario);
          this.formGroup.get('sexo') ?. setValue(data[0] ?. sexo);
          this.formGroup.get('direccion') ?. setValue(data[0] ?. direccion);
          this.formGroup.get('nroTelefono') ?. setValue(data[0] ?. nroTelefono);
          this.formGroup.get('tipoOperador') ?. setValue(data[0] ?. codOperador);
          this.formGroup.get('correo') ?. setValue(data[0] ?. correo);
          this.formGroup.get('copiDni') ?. setValue(toFile(data[0] ?. copiDni as string, data[0] ?. nomUsuario + '_DNI.pdf', 'application/pdf'));
          setTimeout(() => {
              if (this.idCrud.split('-')[1] === '03') {
                  this.formGroup.get('copiPartidaNacimiento') ?. setValue(toFile(data[0] ?. copiPartidaNacimiento as string, data[0] ?. nomUsuario + '_PN.pdf', 'application/pdf'));
                  this.formGroup.get('foto') ?. setValue(toFile(data[0] ?. foto as string, data[0] ?. nomUsuario + '_FOTO.pdf', 'application/pdf'));
                  this.formGroup.get('certEstudio') ?. setValue(toFile(data[0] ?. certEstudio as string, data[0] ?. nomUsuario + '_CRT.pdf', 'application/pdf'));
              }
          }, 0);
          if (this.idCrud.split('-')[1] === '02') {
              this.onChangePerfil(tipoUsuario).then((e) => {
                  setTimeout(() => {
                      if (e) {
                          this.gridApiCurso.forEachNode((e) => {
                              e.setSelected(false);
                              if (e.data?.idCurso === data[0]?.idCursos.find((x:number)=> x === e.data?.idCurso)) e.setSelected(true);
                          });
                      }
                  }, 200);
              });
          } else if (this.idCrud.split('-')[1] === '03') {
              this.onChangePerfil(tipoUsuario).then((e) => {
                  setTimeout(() => {
                      if (e) {
                          this.gridApiApoderado.forEachNode((e) => {
                              e.setSelected(false);
                              if (e.data.idApoderado == this.respListUpdate[0] ?. idApoderado) {
                                  e.setSelected(true);
                              }
                          });
                      }
                  }, 200);
              });
          }
      }
        });
  }

  initColumn() {
      this.columnDefsApoderado = [
          {
              headerName: '',
              field: 'idApoderado',
              minWidth: 40,
              width: 40,
              maxWidth: 40,
              headerCheckboxSelection: true,
              checkboxSelection: true,
              lockPosition: true,
              pinned: 'left',
              cellStyle: {
                  display: 'flex',
                  'align-items': 'center'
              }
          },
          {
              headerName: 'Nombres',
              field: 'nombre',
              width: 220
          },
          {
              headerName: 'Ap. Paterno',
              field: 'apPaterno',
              width: 200,
              sort: 'asc'
          },
          {
              headerName: 'Ap. Materno',
              field: 'apMaterno',
              width: 200
          }, {
              headerName: 'Nro. DNI',
              field: 'nroDni',
              width: 200
          }, {
              headerName: 'Nro. Celular',
              field: 'nroTelefono',
              width: 200
          }, {
              headerName: 'Tipo operador',
              field: 'codOperador',
              width: 200,
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
              }
          },
      ];

      this.columnDefsCurso = [
          {
              headerName: '',
              field: 'idCurso',
              minWidth: 40,
              width: 40,
              maxWidth: 40,
              headerCheckboxSelection: true,
              checkboxSelection: true,
              lockPosition: true,
              pinned: 'left',
              cellStyle: {
                  display: 'flex',
                  'align-items': 'center'
              }
          },

          {
              headerName: 'Cod. Curso',
              field: 'codCurso',
              width: 150,
              sort: 'asc'
          },
          {
              headerName: 'Curso',
              field: 'nombre',
              width: 150
          },
          {
              headerName: 'Horas',
              field: 'horas',
              width: 150
          }, {
              headerName: 'Descripción',
              field: 'descripcion',
              width: 150
          }, {
            headerName: 'Nivel Academico',
            field: 'nivel',
            width: 150
          }, {
            headerName: 'Grado',
            field: 'nomGrado',
            width: 150
          }, {
              headerName: 'Estado',
              field: 'estado',
              valueGetter(params) {
                  return params.data.estado ? 'Activo' : 'Inactivo';
              },
              width: 150
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

  getId(resource : any): number {
      if (this.isAlumno) {
          return resource.data.idApoderado !;
      } else {
          return resource.data.idCurso !;
      }
  }

  onButtonActionAgGrid(type : string, rowNode : any): void {
    if(type === EnumButtonType.TYPE_EDIT){
      this.genericEdit(rowNode);
    }
      console.log('111111', {type, rowNode});
  }

  async onChangePerfil(e : any): Promise < Boolean > {
      let resp = false;
      this.onClearValueForm();
      this.isAlumno = false;
      switch (e.value) {
          case '01':
              this.isSelect = 0;
              this.isDocente = false;
              break;
          case '02':
              const search : SearchCurso = {
                idCurso: 0
              }
              this.cursoDto$ = this.tbCursoService.listCurso(search);
              await Promise.all(convertObserverToPromise(this.cursoDto$));
              this.isSelect = 1;
              this.isAlumno = false;
              this.isDocente = true;
              if (this.cursoDto$) resp = true;
              break;
          default:
              this.apoderadoDto$ = this.tbApoderadoService.listApoderado((this.searchUsuarioDto = new SearchUsuarioDto()));
              await Promise.all(convertObserverToPromise(this.apoderadoDto$));
              this.formGroup.get('copiPartidaNacimiento') ?. setValidators([Validators.required]);
              this.formGroup.get('foto') ?. setValidators([Validators.required]);
              this.formGroup.get('certEstudio') ?. setValidators([Validators.required]);
              this.isSelect = 2;
              this.isAlumno = true;
              this.isDocente = false;
              if (this.apoderadoDto$) resp = true;
              break;
      }
      return resp;
  }

  onClearValueForm(): void {
      const data = {
          copiPartidaNacimiento: null,
          foto: null,
          certEstudio: null
      };
      this.formGroup.patchValue(data);
      Object.keys(this.formGroup.controls).forEach((key) => {
          if (key == 'certEstudio' || key == 'foto' || key == 'certEstudio' || key == 'copiPartidaNacimiento') {
              this.formGroup.get(key) ?. setErrors(null);
              this.formGroup.get(key) ?. markAsUntouched();
          }
      });
  }

  onGridReadyApoderado(gridApi : GridApi, gridApiColumn : ColumnApi): void {
      this.gridApiApoderado = gridApi;
      this.gridColumnApiApoderado = gridApiColumn;
  }
  onGridReadyCurso(gridApi : GridApi, gridApiColumn : ColumnApi): void {
      this.gridApiCurso = gridApi;
      this.gridColumnApiCurso = gridApiColumn;
  }

  async setCloseDialog(boolean : boolean): Promise<void> {
      if (boolean) {
          if (this.isAlumno) {
              this.gridApiApoderado.setRowData([]);
              this.apoderadoDto$ = this.tbApoderadoService.listApoderado((this.searchUsuarioDto = new SearchUsuarioDto()));
              await Promise.all(convertObserverToPromise(this.apoderadoDto$));
              if (this.respListUpdate ?. length != 0 && this.apoderadoDto$) {
                setTimeout(() => {
                  this.gridApiApoderado.forEachNode((e) => {
                      e.setSelected(false);
                      if (e.data.idApoderado == this.respListUpdate[0] ?. idApoderado) {
                          e.setSelected(true);
                      }
                  });
                }, 200);
              }
          } else {
              this.gridApiCurso.setRowData([]);
              const search : SearchCurso = {
                idCurso: 0
              }
              this.cursoDto$ = this.tbCursoService.listCurso(search);
              await Promise.all(convertObserverToPromise(this.cursoDto$));
              if (this.respListUpdate && this.cursoDto$) {
                  setTimeout(() => {
                      this.gridApiCurso.forEachNode((e) => {
                          e.setSelected(false);
                          if (e.data?.idCurso === this.respListUpdate[0]?.idCursos.find((x:number)=> x = e.data?.idCurso)) e.setSelected(true);
                      });
                  }, 200);
              }
          }
      }
  }

  onSave(): void {
    if (this.formGroup.valid) {
      if (this.idCrud.split('-')[0] != '0') {
        this.update();
      } else {
        this.insert();
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  cargarpdf(element : any, index : number) {
      const file: File = element.files[0];
      console.log(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          console.log('documento PDF', reader.result);
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
      this.tTbUsuarioInsertOrUpdateDto = this.setResourceToSave('R');
      this.tbUsuarioService.insert(this.tTbUsuarioInsertOrUpdateDto).subscribe((res) => {
          if (res !== null && res.codError !== 0) {
              this.loading.hide();
              this.messageUtilService.getMessageSuccess('Registro exitoso', 'El usuario se registró correctamente.');
              //this.router.navigate(['#/nav/usuario']);
          } else {
              this.loading.hide();
              this.messageUtilService.getMessageInfo('Ya existe un registro con el  Nro. DNI: ' + `${this.tTbUsuarioInsertOrUpdateDto ?. nroDni}`);
          }
      }, (err) => this.loading.hide());
  }

  update(): void {
      this.loading.showSmall('Actualizando...');
      this.tTbUsuarioInsertOrUpdateDto = this.setResourceToSave('E');
      this.tbUsuarioService.update(this.tTbUsuarioInsertOrUpdateDto).subscribe((res) => {
          if (res !== null && res.codError === 1) {
              this.loading.hide();
              this.messageUtilService.getMessageSuccess('Actualización exitosa', 'El usuario se actualizó correctamente.');
              this.router.navigate(['../alumno']);
          }
      }, (err) => this.loading.hide());
  }

  setResourceToSave(accion : string): TbUsuarioInsertOrUpdateDto {
      const valueForm = this.formGroup.getRawValue();
      const tTbUsuarioInsertOrUpdateDto: TbUsuarioInsertOrUpdateDto = {};
      let getApoderado: any = null;
      let getCurso: any = null;
      const tipoOperador = EnumTipoOperador.TIPO_OPERADOR.find((e : any) => e.value == valueForm.codOperador);
      const getValuePerfil = this.perfil.find((e : any) => e.value == valueForm.codPerfil);
      if (this.isAlumno) {
          getApoderado = this.gridApiApoderado.getSelectedRows();
      } else if (this.isDocente) {
          getCurso = this.gridApiCurso.getSelectedRows();
      }
      if (Number(this.idCrud.split('-')[0]) != 0 && accion == 'E') {
          tTbUsuarioInsertOrUpdateDto.idUsuario = + this.idCrud.split('-')[0];
          tTbUsuarioInsertOrUpdateDto.idContacto = this.respListUpdate[0].idContacto;
          tTbUsuarioInsertOrUpdateDto.idDetalle = this.respListUpdate[0].idDetalle;

          tTbUsuarioInsertOrUpdateDto.copiDni = this.archivos.copiDni === undefined ? this.respListUpdate[0] ?. copiDni : (this.archivos.copiDni as string);
          tTbUsuarioInsertOrUpdateDto.copiPartidaNacimiento = this.archivos.copiPartidaNacimiento === undefined ? this.respListUpdate[0] ?. copiPartidaNacimiento : (this.archivos.copiPartidaNacimiento as string);
          tTbUsuarioInsertOrUpdateDto.foto = this.archivos.foto === undefined ? this.respListUpdate[0] ?. foto : (this.archivos.foto as string);
          tTbUsuarioInsertOrUpdateDto.certEstudio = this.archivos.certEstudio === undefined ? this.respListUpdate[0] ?. certEstudio : (this.archivos.certEstudio as string);
      } else {
          tTbUsuarioInsertOrUpdateDto.copiDni = this.archivos.copiDni !== undefined ? (this.archivos.copiDni as string) : null;
          tTbUsuarioInsertOrUpdateDto.copiPartidaNacimiento = this.archivos.copiPartidaNacimiento !== undefined ? (this.archivos.copiPartidaNacimiento as string) : null;
          tTbUsuarioInsertOrUpdateDto.foto = this.archivos.foto !== undefined ? (this.archivos.foto as string) : null;
          tTbUsuarioInsertOrUpdateDto.certEstudio = this.archivos.certEstudio !== undefined ? (this.archivos.certEstudio as string) : null;
      }
      tTbUsuarioInsertOrUpdateDto.codPerfil = valueForm.codPerfil;
      tTbUsuarioInsertOrUpdateDto.idPerfil = getValuePerfil.idPerfil;
      tTbUsuarioInsertOrUpdateDto.nombre = valueForm.nombre;
      tTbUsuarioInsertOrUpdateDto.apPaterno = valueForm.apPaterno;
      tTbUsuarioInsertOrUpdateDto.apMaterno = valueForm.apMaterno;
      tTbUsuarioInsertOrUpdateDto.nroDni = valueForm.nroDni;
      tTbUsuarioInsertOrUpdateDto.fchNacimiento = this._dateFormatPipe.formatDate(valueForm.fchNacimiento, 'yyyy-MM-dd');
      tTbUsuarioInsertOrUpdateDto.sexo = valueForm.sexo;
      tTbUsuarioInsertOrUpdateDto.nroTelefono = valueForm.nroTelefono;
      tTbUsuarioInsertOrUpdateDto.tipoOperador = tipoOperador ?. label.split('-')[1].trim();
      tTbUsuarioInsertOrUpdateDto.codOperador = valueForm.codOperador;
      tTbUsuarioInsertOrUpdateDto.correo = valueForm.correo;
      tTbUsuarioInsertOrUpdateDto.direccion = valueForm.direccion;
      tTbUsuarioInsertOrUpdateDto.estadoAlumno = 1;
      tTbUsuarioInsertOrUpdateDto.idCursos = (getCurso ?. length != 0 && getCurso != null) ? getCurso?.map((getCurso:any) => {return getCurso.idCurso }) : null;//getCurso ?. length != 0 && getCurso != null ? getCurso[0].idCurso : null;
      tTbUsuarioInsertOrUpdateDto.idApoderado = (getApoderado ?. length != 0 && getApoderado != null) ? getApoderado[0].idApoderado : null;
      return {... tTbUsuarioInsertOrUpdateDto};
  }
  ngOnDestroy(): void {
      this.subscription$.forEach((s) => s.unsubscribe());
  }
}
