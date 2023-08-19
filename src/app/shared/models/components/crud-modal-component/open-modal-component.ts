import { Component, OnInit, Inject, } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, GridApi } from 'ag-grid-community';
import Swal from 'sweetalert2';

@Component({ template: '' })
export abstract class CrudModalComponent<T> {
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  rowData: Observable<any> = of([]);

  constructor(@Inject(String) protected typeAccion?: string | null) {
    console.log('typeAccionsssss', typeAccion);
  }

  // abstract getFormValue(resource: T): any;
  /* onSave() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        width: '30%',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          showLoading();
          setTimeout(() => {
            Swal.fire({
              title: `Deleted`,
              width: '30%',
              text: 'Your file has been deleted.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            });
          }, 5000);

        }
      })
      const valueForm = this.formGroup.getRawValue();
      const tbCursoDto: TbCursoDto = {
        idCurso: this.data.idCrud,
        codCurso: valueForm.codCurso,
        horas: this.data.idCrud ? valueForm.horas : valueForm.horas + ":00",
        nombre: valueForm.curso,
        descripcion: valueForm.descripcion
      }
      if(this.data.idCrud != null){
        if (this.formGroup.valid) {
          this.spinner.show();
          this.tbCursoService.update(tbCursoDto).subscribe((e) => {
            if (e.codError == 1){
              console.log(e);
              this.spinner.hide();
              this.dialogRef.close(true);
            }else{
              this.spinner.hide();
            }
          });
        } else {
          this.formGroup.markAllAsTouched();
        }
      } else if (this.formGroup.valid) {
        this.spinner.show();
        this.tbCursoService.insert(tbCursoDto).subscribe((e) => {
          if (e.codError == 1){
            this.spinner.hide();
            this.dialogRef.close(true);
          }else{
            this.spinner.hide();
          }
        });
      } else {
        this.formGroup.markAllAsTouched();
      }

    }*/
  onUpdate(resource: any) {
    console.log('resouce Update', resource);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      width: '30%',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          Swal.fire({
            title: `Deleted`,
            width: '30%',
            text: 'Your file has been deleted.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
          });
        }, 5000);
      }
    });
    /*this.tbCursoService.update(resource).subscribe((e) => {
      if (e.codError == 1) {
        console.log(e);
        this.spinner.hide();
        this.dialogRef.close(true);
      } else {
        this.spinner.hide();
      }
    });*/
  }

  onSave(resource: any) {
    /*this.tbCursoService.insert(tbCursoDto).subscribe((e) => {
      if (e.codError == 1){
        this.spinner.hide();
        this.dialogRef.close(true);
      }else{
        this.spinner.hide();
      }
    });*/
    console.log('resouce onSave', resource);
  }
}
