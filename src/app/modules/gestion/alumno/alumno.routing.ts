import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListarAlumnoComponent } from './listar-alumno/listar-alumno.component';

const routes: Routes = [
  {
    path: '',
    component: ListarAlumnoComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule {}
