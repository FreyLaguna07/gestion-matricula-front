import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridMasterComponent } from './ag-grid-master/ag-grid-master.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AgGridMasterComponent
  ],

  imports: [
    CommonModule,
    AgGridModule
  ],

  exports: [
    AgGridMasterComponent
  ],
  providers: [],
})
export class ComponentModule {}
