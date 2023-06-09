import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataDialog } from 'src/app/shared/classes/modal-crud-component/DataDialog';

@Component({
  selector: 'app-registrar-alumno',
  templateUrl: './registrar-alumno.component.html',
  styleUrls: ['./registrar-alumno.component.scss']
})
export class RegistrarAlumnoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RegistrarAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog
  ) { }

  ngOnInit() {
  }

}
