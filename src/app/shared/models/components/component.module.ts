import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridMasterComponent } from './ag-grid-master/ag-grid-master.component';

@NgModule({
  declarations: [
    AgGridMasterComponent
  ],

  imports: [ CommonModule ],

  exports: [
    AgGridMasterComponent
  ],
  providers: [],
})
export class ComponentModule {}
