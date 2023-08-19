import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: ListarUsuarioComponent
  },
  {
    path: 'registrar/:id',
    component: RegistrarUsuarioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule {}
