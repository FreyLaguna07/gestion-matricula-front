import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonsRoutingModule } from './commons.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ReporteMatriculaComponent } from './reporte-matricula/reporte-matricula.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ReporteMatriculaComponent],
  imports: [
    CommonModule,
    CommonsRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
   ],
  exports: [],
  providers: [],
})
export class CommonsModule {}
