import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataDialog } from 'src/app/@utils/modal-crud-component/DataDialog';
import { ModalRegistrarCursoComponent } from '../../usuario/common/modal-registrar-curso/modal-registrar-curso.component';

@Component({
  selector: 'app-reporte-matricula',
  templateUrl: './reporte-matricula.component.html',
  styleUrls: ['./reporte-matricula.component.scss']
})
export class ReporteMatriculaComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: DataDialog,
  ) { }

  ngOnInit(): void { }

  download(): void {
		window.print();
	}
}
