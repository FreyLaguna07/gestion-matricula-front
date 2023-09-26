import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentModule } from 'src/app/shared/models/components/component.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/material/material.module';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { UsuarioRoutingModule } from './usuario.routing';

@NgModule({
  declarations: [
    ListarUsuarioComponent,
    RegistrarUsuarioComponent,
  ],
  imports: [
    ReactiveFormsModule,
    UsuarioRoutingModule,
    ComponentModule,
    AgGridModule,
    CommonModule,
    MaterialModule,
  ],
  exports: [],
  providers: [DatePipe],
})
export class UsuarioModule {}
