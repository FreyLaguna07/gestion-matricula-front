import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ColDef, RowNode, UserCompDetails } from 'ag-grid-community';
import { Observable, map, of } from 'rxjs';
import { Loading } from 'src/app/@utils/models/Loading';
import { MessageUtilService } from 'src/app/@utils/models/message-util.service';
import { NgSelect } from 'src/app/@utils/models/ngselect.interfaces';
import { TbGradoService, TbMatriculaService, TbUsuarioService } from 'src/app/core/services';
import { TbCursoService } from 'src/app/core/services/TbCursoService.service';
import { TbGradoDto, TbMatriculaDto, TbUsuarioDto } from 'src/app/shared/classes';
import { SearchCurso, SearchUsuarioDto } from 'src/app/shared/classes-custom';

@Component({
  selector: 'app-registrar-matricula',
  templateUrl: './registrar-matricula.component.html',
  styleUrls: ['./registrar-matricula.component.scss']
})
export class RegistrarMatriculaComponent implements OnInit {

  formGroup!: FormGroup;

  rowData$: Observable<any[]> = of([]);
  columnDefs: ColDef[] = [];
  idCrud: any;
  nivelAcademico = 'PRIMARIA';
  isListAlumno: any;
  loading = new Loading();
  tbMatriculaDto!: TbMatriculaDto;

  ngSelectNivel$: Observable<{ label: string; value: string }[]> = of([
    { value: 'PRIMARIA', label: '01 - PRIMARIA' },
    { value: 'SECUNDARIA', label: '02 - SECUNDARIA' },
  ]);

  ngSelectGrado$: Observable<TbGradoDto[]> = of([]);

  ngSelectSeccion$:Observable<{ label: string; value: string }[]> = of([
    { value: 'A', label: 'SA - SECCION A' },
    { value: 'B', label: 'SA - SECCION B' },
    { value: 'C', label: 'SC - SECCION C' },
  ]);

  constructor(
    private readonly _fb: FormBuilder,
    public readonly tbCursoService : TbCursoService,
    private route : ActivatedRoute,
    public readonly tbUsuarioService: TbUsuarioService,
    public readonly tbGradoService: TbGradoService,
    public readonly tbMatriculaService: TbMatriculaService,
    private readonly messageUtilService : MessageUtilService,
  ) {
    this.initForm();
    this.route.paramMap.subscribe((params : ParamMap) => {
      this.idCrud = params.get('id');
  });
  }

  ngOnInit() {
    console.log(this.idCrud);
    this.initColumn();
    this.initRowData();
    this.fillForm();
  }

  initForm() {
    this.formGroup = this._fb.group({
      nombre:[null],
      apPaterno: [null],
      apMaterno: [null],
      nroDni: [null],
      sexo: [null],
      anioEscolar: [null],
      tipoFiltro: [null],
      grado: [null],
      seccion: [null],
      cantAlumno: [null],
      estAlumno: {value: true, disabled: true}
    });
  }
  imageBase64:any = [];
  async fillForm(): Promise<void> {
    const search: SearchUsuarioDto = {
      idUsuario: this.idCrud.split('-')[0],
      codPerfil: this.idCrud.split('-')[1]
    }
    const [resp] = await this.tbUsuarioService.listAlumMatriula(search) as TbUsuarioDto[];
    if(resp !== undefined){
      this.isListAlumno = resp;
      const valueForm = {
        nombre: resp.nomUsuario,
        apPaterno: resp.apPaternoUsuario,
        apMaterno: resp.apMaternoUsuario,
        nroDni: resp.nroDniUsuario,
        sexo: resp.sexo === 'F' ? 'FEMENINO' : 'MASCULINO',
        anioEscolar: new Date().getFullYear(),
      }
      this.imageBase64.dni = resp.foto;
      this.formGroup.patchValue(valueForm);
    }
    console.log(resp);
  }

  async initRowData(): Promise<void> {
    // const search : SearchCurso = {
    //   idCurso: 0
    // }
    // this.rowData$ = this.tbCursoService.listCurso(search);
    this.ngSelectGrado$ = this.tbGradoService.getSelectList(this.nivelAcademico);

    // const searchCantAlum : SearchCurso = {
    //   nivelAcademico: 'PRIMARIA',
    //   codGrado: '1P',
    //   seccion: 'A'
    // }
    // const respCantAlum = await this.tbMatriculaService.countAlumnosMatriculados(searchCantAlum).toPromise();
    // if(respCantAlum != null){
    //   this.formGroup.get('cantAlumno')?.setValue(respCantAlum);
    // }
  }

  initColumn() {
    this.columnDefs = [
     /* {
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
      },*/
      {
        headerName: 'Curso',
        field: 'nombre',
        minWidth: 150,
        width: 150,
        maxWidth: 150,
        lockPosition: true,
        pinned: 'left',
        cellClass: ['d-flex', 'justify-content-center'],
      },
      {
        headerName: 'Cod. Curso',
        field: 'codCurso',
        minWidth: 100,
        width: 100,
        maxWidth: 100,
        lockPosition: true,
        pinned: 'left',
        cellClass: ['d-flex', 'justify-content-center'],
      },
      /*{
          headerName: 'Cod. Curso',
          field: 'codCurso',
          cellStyle: {
            display: 'flex',
            'align-items': 'center'
          },
          width: 150,
          sort: 'asc'
      },
      {
          headerName: 'Curso',
          field: 'nombre',
          width: 150
      },*/
      {
          headerName: 'Horas pedagógicas',
          field: 'horas',
          minWidth: 150,
          width: 150,
          maxWidth: 150,
      },
      {
          headerName: 'Descripción',
          field: 'descripcion',
          minWidth: 150,
          width: 150,
          maxWidth: 150,
      },
      {
        headerName: 'Grado',
        field: 'nomGrado',
        minWidth: 120,
        width: 120,
        maxWidth: 120,
      },
      {
        headerName: 'Nivel Academico',
        field: 'nivel',
        minWidth: 120,
        width: 120,
        maxWidth: 120,

      },
      {
        headerName: 'Docente',
        field: 'nivel',
        minWidth: 150,
        width: 150,
        valueGetter(params: any){
          return params.data.nomDocente + ' ' + params.data.apPaternoDocente  + ' ' + params.data.apMaternoDocente;
        }
      },
      {
        headerName: 'Nro. DNI',
        field: 'nroDniDocente',
        minWidth: 100,
        width: 100,
        maxWidth: 100,
      },
      {
          headerName: 'Estado',
          field: 'estado',
          valueGetter(params) {
              return params.data.estado ? 'Activo' : 'Inactivo';
          },
          minWidth: 120,
          width: 120,
      },
    ];
  }

  onChangeSelectNivelAcademico(e: NgSelect): void {
    this.ngSelectGrado$ = this.tbGradoService.getSelectList(String(e.value));
    if(e.value !== this.nivelAcademico){
      this.formGroup.get('grado')?.setValue(7);
    } else {
      this.formGroup.get('grado')?.setValue(1);
    }
    const search : SearchCurso = {
      idCurso: 0,
      idGrado: this.formGroup.get('grado')?.value,
      nivelAcademico: String(e.value),
    }

    this.searchCurso(search);
  }

  onChangeSelectGrado(e: any): void {
    const search : SearchCurso = {
      idCurso: 0,
      idGrado: Number(e.value),
      nivelAcademico: this.formGroup.get('tipoFiltro')?.value,
    }
    this.searchCurso(search);
  }

  isSearchCurso = false;
  searchCurso(search: SearchCurso): void {
    if(this.isSearchCurso){
      this.rowData$ = this.tbCursoService.listCurso(search);
      this.searchCantAlumno();
    }
    this.isSearchCurso = true;
  }

  isSearchCantAlumno = false;
  onChangeSelectSeccion(e: NgSelect): void {
    if(this.isSearchCantAlumno){
      this.searchCantAlumno();
    }
    this.isSearchCantAlumno = true;
  }

  searchCantAlumno(): void {
    setTimeout(() => {
      let valueForm = this.formGroup.getRawValue();
      let searchCantAlum : SearchCurso = {
        nivelAcademico: valueForm.tipoFiltro,
        idGrado: valueForm.grado,
        seccion: valueForm.seccion
      }
      this.tbMatriculaService.countAlumnosMatriculados(searchCantAlum).subscribe(
        respCantAlum => {
          if(respCantAlum != null){
            this.formGroup.get('cantAlumno')?.setValue(respCantAlum);
          }
        }
      );
    }, 100);
  }

  onSave(): void {
    if(this.formGroup.valid){
      if(this.idCrud.split('-')[2] == 'R'){
        this.insert();
      } else if(this.idCrud.split('-')[2] == 'E') {
        this.update();
      }
    }
  }

  insert(): void {
    this.loading.showSmall('Guardando...');
    this.tbMatriculaDto = this.setResourceToSave('R');
    this.tbMatriculaService.insert(this.tbMatriculaDto).subscribe((res) => {
      console.log("resp ",res);
        if (res !== null && res.codError === 1) {
            this.loading.hide();
            this.messageUtilService.getMessageSuccess('Registro exitoso', 'El usuario se registró correctamente.');
        } else {
            this.loading.hide();
            this.messageUtilService.getMessageInfo('El alumno con Nro. DNI: ' + `${this.formGroup.get('nroDni')?.value}`);
        }
    }, (err) => this.loading.hide());
}

update(): void {
    /*this.loading.showSmall('Actualizando...');
    this.tTbUsuarioInsertOrUpdateDto = this.setResourceToSave('E');
    this.tbMatriculaService.update(this.tTbUsuarioInsertOrUpdateDto).subscribe((res) => {
        if (res !== null && res.codError === 1) {
            this.loading.hide();
            this.messageUtilService.getMessageSuccess('Actualización exitosa', 'El usuario se actualizó correctamente.');
            this.router.navigate(['./nav/alumno']);
        }
    }, (err) => this.loading.hide());*/
}

  setResourceToSave(type: string): TbMatriculaDto {
    const valueForm = this.formGroup.getRawValue();
    console.log("valueForm",valueForm);
    const tbMatriculaDto : TbMatriculaDto = {};
    if(this.idCrud.split('-')[3] == 'E'){
      tbMatriculaDto.idMatricula = null;
    }
    tbMatriculaDto.idGrado = valueForm.grado
    tbMatriculaDto.idUsuario = this.isListAlumno.idUsuario;
    tbMatriculaDto.periodo = new Date().getFullYear()+'-1';
    tbMatriculaDto.seccion = valueForm.seccion;
    return {...tbMatriculaDto};
  }
}
