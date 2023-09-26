import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListarMatriculaComponent } from './listar-matricula/listar-matricula.component';
import { RegistrarMatriculaComponent } from './registrar-matricula/registrar-matricula.component';

const routes: Routes = [
  { path: '',
    component: ListarMatriculaComponent
  },
  {
    path: 'registrar/:id',
    component: RegistrarMatriculaComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculaRoutingModule {}
