import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarAlumnoComponent } from './listar-alumno/listar-alumno.component';
import { RegistrarAlumnoComponent } from './registrar-alumno/registrar-alumno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlumnoRoutingModule } from './alumno.routing';
import { ComponentModule } from 'src/app/shared/models/components/component.module';

@NgModule({
  declarations: [
    ListarAlumnoComponent,
    RegistrarAlumnoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlumnoRoutingModule,
    ComponentModule
  ],
  exports: [],
  providers: [],
})
export class AlumnoModule {}
