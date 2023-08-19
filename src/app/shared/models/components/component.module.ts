import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectSimpleComponent } from './ng-select-simple/ng-select-simple.component';
import { MaterialModule } from 'src/app/material/material.module';
import { InputTextComponent } from './input-text/input-text.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { InputFileComponent } from './input-file/input-file.component';
import { AgGridCustomizableComponent } from './ag-grid-customizable/ag-grid-customizable.component';
import { CellRendererButtonComponent } from './renderable-cells/actions/cell-render-button/cell-render-button.component';
import { CheckboxListComponent } from './ag-grid-render/checkbox-list.component';
import { EditButtonComponent } from './ag-grid-render/edit-button.component';
import { EditDeleteComponent } from './ag-grid-render/edit-delete.component';
import { ScButton } from './sc-button/sc-button.component';
import { ScButtonModule } from './sc-button/sc-button.module';
import { InputTextAreaComponent } from './input-text-area/input-text-area.component';
import { InputTimeComponent } from './input-time/input-time.component';


@NgModule({
  declarations: [
    NgSelectSimpleComponent,
    InputTextComponent,
    InputTextAreaComponent,
    DatePickerComponent,
    InputNumberComponent,
    InputFileComponent,
    CellRendererButtonComponent,
    CheckboxListComponent,
    EditButtonComponent,
    EditDeleteComponent,
    AgGridCustomizableComponent,
    InputTimeComponent
  ],

  imports: [
    CommonModule,
    AgGridModule,
    MaterialModule,
    ScButtonModule,
  ],

  exports: [
    NgSelectSimpleComponent,
    InputTextComponent,
    InputTextAreaComponent,
    DatePickerComponent,
    InputNumberComponent,
    InputFileComponent,
    CellRendererButtonComponent,
    CheckboxListComponent,
    EditButtonComponent,
    EditDeleteComponent,
    AgGridCustomizableComponent,
    InputTimeComponent

  ],
  providers: [],
})
export class ComponentModule {}
