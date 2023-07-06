import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarAlumnoComponent } from './listar-alumno/listar-alumno.component';
import { RegistrarAlumnoComponent } from './registrar-alumno/registrar-alumno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlumnoRoutingModule } from './alumno.routing';
import { ComponentModule } from 'src/app/shared/models/components/component.module';
import { AgGridModule } from 'ag-grid-angular';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ListarAlumnoComponent,
    RegistrarAlumnoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlumnoRoutingModule,
    ComponentModule,
    MatExpansionModule,
    AgGridModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule,


  ],
  exports: [],
  providers: [],
})
export class AlumnoModule {}
