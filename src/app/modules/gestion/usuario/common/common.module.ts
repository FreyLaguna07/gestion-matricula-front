import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { ModalRegistrarCursoComponent } from './modal-registrar-curso/modal-registrar-curso.component';
import { ScButtonModule } from 'src/app/shared/models/components/sc-button/sc-button.module';
import { ComponentModule } from 'src/app/shared/models/components/component.module';
import { ModalRegistrarApoderadoComponent } from './modal-registrar-apoderado/modal-registrar-apoderado.component';

@NgModule({
  declarations: [ModalRegistrarCursoComponent, ModalRegistrarApoderadoComponent],
  imports: [ MaterialModule, ComponentModule ],
  exports: [ModalRegistrarCursoComponent],
  providers: [],
})
export class CommonModule {}
