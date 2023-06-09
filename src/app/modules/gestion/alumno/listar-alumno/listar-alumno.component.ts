import { Component, OnInit, Inject } from '@angular/core';
import { RegistrarAlumnoComponent } from '../registrar-alumno/registrar-alumno.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-listar-alumno',
  templateUrl: './listar-alumno.component.html',
  styleUrls: ['./listar-alumno.component.scss']
})
export class ListarAlumnoComponent implements OnInit {

  constructor(
    protected dialog: MatDialog | null,

  ) { }

  ngOnInit() {
  }

  router(){
    return RegistrarAlumnoComponent;
  }

  openDialog(resource?: any) {
    let subtitle: string = '';
    let type: string = '';
    let idCrud: number | null = null;
    if (resource === undefined) {
        subtitle = 'Registro';
        type = 'R';
    } else if (resource !== null) {
        subtitle = 'Edición';
        type = 'E';
        //idCrud = this.getId(resource) || null;
    }
    this.dialog?.open(this.router(), {
        width: '550px',
        disableClose: true,
        data: {
            subtitle: subtitle,
            type: type,
            idCrud: idCrud
        }
    }).afterClosed().subscribe(response => {
      console.log("aquiii");
       // if (response) { this.genericList(); }
    });
}
}
