import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, of } from 'rxjs';
import { DataDialog } from 'src/app/@utils/modal-crud-component/DataDialog';
import { Loading } from 'src/app/@utils/models/Loading';
import { MessageUtilService } from 'src/app/@utils/models/message-util.service';
import { TbApoderadoService } from 'src/app/core/services';
import { SearchUsuarioDto } from 'src/app/shared/classes';
import { TbApoderadoDto } from 'src/app/shared/classes/TbApoderadoDto';
import { EnumTipoOperador } from 'src/app/shared/enum/EnumTipoOperador';

@Component({
  selector: 'app-modal-registrar-apoderado',
  templateUrl: './modal-registrar-apoderado.component.html',
  styleUrls: ['./modal-registrar-apoderado.component.scss'],
})
export class ModalRegistrarApoderadoComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  subscription$: Subscription[] = [];
  ngSelectTipoOperador: Observable<{ label: string; value: string }[]> = of(EnumTipoOperador.TIPO_OPERADOR);
  tbApoderadoDto!: TbApoderadoDto;
  loading!: Loading;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    private readonly _fb: FormBuilder,
    public readonly tbApoderadoService: TbApoderadoService,
    private spinner: NgxSpinnerService,
    private readonly dialogRef: MatDialogRef<ModalRegistrarApoderadoComponent>,
    private readonly messageUtilService: MessageUtilService,
  ) {this.initForm()}

  ngOnInit() {
    if(this.data.type === "E") this.fillForm();
    console.log('modalApoderado', this.data);
  }

  initForm(): void {
    this.formGroup = this._fb.group({
      nombre: [null, Validators.required],
      apPaterno: [null, Validators.required],
      apMaterno: [null, Validators.required],
      nroDni: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      nroCell: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      codOperador: [null, Validators.required],
    });
  }

  fillForm(){
    const searchUsuarioDto : SearchUsuarioDto= {
      idApoderado: this.data.idCrud,
    }
    this.subscription$.push( this.tbApoderadoService.listApoderado(searchUsuarioDto).subscribe(data =>{
      if(data != null){
        this.formGroup.get('nombre')?.setValue(data[0]?.nombre);
        this.formGroup.get('apPaterno')?.setValue(data[0]?.apPaterno);
        this.formGroup.get('apMaterno')?.setValue(data[0]?.apMaterno);
        this.formGroup.get('nroDni')?.setValue(data[0]?.nroDni);
        this.formGroup.get('nroCell')?.setValue(data[0]?.nroTelefono);
        this.formGroup.get('codOperador')?.setValue(data[0]?.codOperador);
      }
    }));
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
    this.tbApoderadoDto = this.setResourceToSave("R");
    this.tbApoderadoService.insert(this.tbApoderadoDto).subscribe((res) => {
      if (res !== null && res.codError === 1) {
        this.loading.hide();
        this.messageUtilService.getMessageSuccess("Registro exitoso", "El curso se registró correctamente.");
        this.dialogRef.close(true);
      }else{
        this.loading.hide();
        this.messageUtilService.getMessageInfo("Ya existe un registro con el código "+`${this.tbApoderadoDto?.nroDni}`);
      }
    }, err => this.loading.hide());
  }

  update() {
    this.loading.showSmall('Actualizando...');
    this.tbApoderadoDto = this.setResourceToSave("E");
    this.tbApoderadoService.update(this.tbApoderadoDto).subscribe((res) => {
      if (res !== null && res.codError === 1) {
        this.loading.hide();
        this.messageUtilService.getMessageSuccess("Actualización exitosa", "El curso se actualizó correctamente.");
        this.dialogRef.close(true);
      }
    }, err => this.loading.hide());
  }

  setResourceToSave(accion: string): TbApoderadoDto {
    const valueForm = this.formGroup.getRawValue();
    const tbApoderadoDto: TbApoderadoDto = {};
    if (accion === 'E') {
      tbApoderadoDto.idApoderado = this.data.idCrud;
    }
    tbApoderadoDto.nombre = valueForm.nombre;
    tbApoderadoDto.apPaterno = valueForm.apPaterno;
    tbApoderadoDto.apMaterno = valueForm.apMaterno;
    tbApoderadoDto.nroDni = valueForm.nroDni;
    tbApoderadoDto.nroTelefono = valueForm.nroCell;
    tbApoderadoDto.codOperador = valueForm.codOperador;
    return {...tbApoderadoDto};
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(s => s.unsubscribe());
}
}
