import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ColDef, UserCompDetails } from 'ag-grid-community';
import { Observable, of } from 'rxjs';
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
  nivelAcademico = 'PRIMARIA'

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
      },
      {
          headerName: 'Descripción',
          field: 'descripcion',
          width: 150
      },
      {
        headerName: 'Grado',
        field: 'nomGrado',
        width: 150
      },
      {
        headerName: 'Nivel Academico',
        field: 'nivel',
        width: 150
      },
      {
        headerName: 'Docente',
        field: 'nivel',
        width: 150,
        valueGetter(params: any){
          return params.data.nomDocente + ' ' + params.data.apPaternoDocente  + ' ' + params.data.apMaternoDocente;
        }
      },
      {
        headerName: 'Nro. DNI',
        field: 'nroDniDocente',
        width: 150
      },
      {
          headerName: 'Estado',
          field: 'estado',
          valueGetter(params) {
              return params.data.estado ? 'Activo' : 'Inactivo';
          },
          width: 150
      },
    ];
  }

  onChangeSelectNivelAcademico(e: NgSelect): void {
    this.ngSelectGrado$ = this.tbGradoService.getSelectList(String(e.value));
    if(e.value !== this.nivelAcademico){
      this.formGroup.get('grado')?.setValue('1S');
    } else {
      this.formGroup.get('grado')?.setValue('1P');
    }
    const search : SearchCurso = {
      idCurso: 0,
      codGrado: this.formGroup.get('grado')?.value,
      nivelAcademico: String(e.value),
    }
    this.searchCurso(search);
  }

  onChangeSelectGrado(e: NgSelect): void {
    const search : SearchCurso = {
      idCurso: 0,
      codGrado: String(e.value),
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
        codGrado: valueForm.grado,
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
      if(this.idCrud.split('-')[3] == 'M'){
        this.insert();
      }else{
        this.update();
      }
    }
  }
  insert(): void {


  }
  update(): void {

  }

  setResourceToSave(): TbMatriculaDto {
    const valueForm = this.formGroup.getRawValue();
    const tbMatriculaDto : TbMatriculaDto = {

    }
    return tbMatriculaDto;
  }
}
