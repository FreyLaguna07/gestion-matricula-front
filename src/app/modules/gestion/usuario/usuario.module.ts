import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentModule } from 'src/app/shared/models/components/component.module';
import { AgGridModule } from 'ag-grid-angular';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { UsuarioRoutingModule } from './usuario.routing';

@NgModule({
  declarations: [
    ListarUsuarioComponent,
    RegistrarUsuarioComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
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
    MaterialModule,
  ],
  exports: [],
  providers: [DatePipe],
})
export class UsuarioModule {}
