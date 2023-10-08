import { Component, OnInit, Inject, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, of } from 'rxjs';
import { DataDialog } from 'src/app/@utils/modal-crud-component/DataDialog';
import { Loading } from 'src/app/@utils/models/Loading';
import { MessageUtilService } from 'src/app/@utils/models/message-util.service';
import { NgSelect } from 'src/app/@utils/models/ngselect.interfaces';
import { TbGradoService } from 'src/app/core/services';
import { TbCursoService } from 'src/app/core/services/TbCursoService.service';
import { TbCursoDto, TbGradoDto,  } from 'src/app/shared/classes';
import { SearchCurso } from 'src/app/shared/classes-custom';
import { CrudModalComponent } from 'src/app/shared/models/components/crud-modal-component/open-modal-component';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-modal-registrar-curso',
  templateUrl: './modal-registrar-curso.component.html',
  styleUrls: ['./modal-registrar-curso.component.scss'],
})
export class ModalRegistrarCursoComponent implements OnInit, OnDestroy, AfterViewChecked {
  formGroup!: FormGroup;
  subscription$: Subscription[] = [];
  readonlyCodCurso = false;
  tbCursoDto!: TbCursoDto;
  loading = new Loading();
  respSearchTbCursoDto!: TbCursoDto;
  ngSelectGrado$: Observable<TbGradoDto[]> = of([]);

  ngSelectNivel$: Observable<{ label: string; value: string }[]> = of([
    { value: 'PRIMARIA', label: '01 - PRIMARIA' },
    { value: 'SECUNDARIA', label: '02 - SECUNDARIA' },
  ]);

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    public dialogRef: MatDialogRef<ModalRegistrarCursoComponent>,
    private readonly _fb: FormBuilder,
    public readonly tbCursoService: TbCursoService,
    private spinner: NgxSpinnerService,
    protected messageUtilService: MessageUtilService,
    public readonly tbGradoService: TbGradoService
  ) {
    this.initForm();
  }

  ngOnInit() {
    if (this.data.type === 'E') this.fillForm();
    console.log('modal', this.data);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initForm(): void {
    this.formGroup = this._fb.group({
      codCurso: [null, Validators.required],
      curso: [null, Validators.required],
      horas: [null, Validators.required],
      descripcion: [null, Validators.required],
      nivAcademico: [null, Validators.required],
      grado: [null, Validators.required],
    });
  }

  onChangeSelectNivelAcademico(e: NgSelect): void {
    this.ngSelectGrado$ = this.tbGradoService.getSelectList(String(e.value));
    if(e.value !== 'PRIMARIA'){
      this.formGroup.get('grado')?.setValue(1);
    } else {
      this.formGroup.get('grado')?.setValue(7);
    }
  }

  fillForm() {
    const search : SearchCurso = {
      idCurso: this.data.idCrud,
    }
    this.subscription$.push(
      this.tbCursoService.listCurso(search).subscribe((data) => {
        if (data != null) {
          this.ngSelectGrado$ = this.tbGradoService.getSelectList(String(data[0]?.nivel));
          this.respSearchTbCursoDto = data[0];
          this.readonlyCodCurso = true;
          this.formGroup.get('codCurso')?.setValue(data[0]?.codCurso);
          this.formGroup.get('curso')?.setValue(data[0]?.nombre);
          this.formGroup.get('horas')?.setValue(data[0]?.horas);
          this.formGroup.get('descripcion')?.setValue(data[0]?.descripcion);
          this.formGroup.get('nivAcademico')?.setValue(data[0]?.nivel);
          setTimeout(() => {
            this.formGroup.get('grado')?.setValue(data[0]?.idGrado);
          }, 300);
        }
      })
    );
  }

  onSave(): void {
    if (this.formGroup.valid) {
      if (this.data.idCrud != null) {
        this.update();
      } else {
        this.insert();
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  insert() {
    this.loading.showSmall('Guardando...');
    this.tbCursoDto = this.setResourceToSave("R");
    this.tbCursoService.insert(this.tbCursoDto).subscribe(res => {
      if (res !== null && res.codError === 1) {
        this.loading.hide();
        this.messageUtilService.getMessageSuccess("Registro exitoso", "El curso se registró correctamente.");
        this.dialogRef.close(true);
      }else{
        this.loading.hide();
        this.messageUtilService.getMessageInfo("Ya existe un registro con el código: "+`${this.tbCursoDto?.codCurso}`);
      }
    }, err => this.loading.hide());
  }

  update() {
    this.loading.showSmall('Actualizando...');
    this.tbCursoDto = this.setResourceToSave("E");
    this.tbCursoService.update(this.tbCursoDto).subscribe(res => {
      if (res !== null && res.codError === 1) {
        console.log("acurlaizfdjafbhdsb");
        this.loading.hide();
        this.messageUtilService.getMessageSuccess("Actualización exitosa", "El curso se actualizó correctamente.");
        this.dialogRef.close(true);
      }
    }, err => this.loading.hide());
  }

  setResourceToSave(accion: string): TbCursoDto {
    const valueForm = this.formGroup.getRawValue();
    const tbCursoDto: TbCursoDto = {};
    console.log(this.respSearchTbCursoDto);
    if (accion === 'E') {
      tbCursoDto.idCurso = this.data.idCrud;
      tbCursoDto.idNuevoGrado = valueForm.grado;
      tbCursoDto.idGrado = this.respSearchTbCursoDto.idGrado;
    } else {
      tbCursoDto.idGrado = valueForm.grado;
    }
    tbCursoDto.codCurso = valueForm.codCurso;
    tbCursoDto.horas = this.data.idCrud ? valueForm.horas : valueForm.horas + ':00';
    tbCursoDto.nombre = valueForm.curso;
    tbCursoDto.descripcion = valueForm.descripcion;
    return tbCursoDto;
  }

  onClose() {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => s.unsubscribe());
  }
}
