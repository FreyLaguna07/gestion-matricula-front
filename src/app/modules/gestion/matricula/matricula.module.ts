import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatriculaRoutingModule } from './matricula.routing';
import { ListarMatriculaComponent } from './listar-matricula/listar-matricula.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentModule } from 'src/app/shared/models/components/component.module';
import { RegistrarMatriculaComponent } from './registrar-matricula/registrar-matricula.component';

@NgModule({
  declarations: [ListarMatriculaComponent, RegistrarMatriculaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatriculaRoutingModule,
    MaterialModule,
    ComponentModule
   ],
  exports: [],
  providers: [],
})
export class MatriculaModule {}
