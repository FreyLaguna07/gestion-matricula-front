import { Component, OnInit, Inject, } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, GridApi } from 'ag-grid-community';

@Component({ template: ''})
export abstract class OpenModalComponent<T>  {

  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  rowData: Observable<any> = of([]);

  constructor(
    protected dialog: MatDialog | null,
    @Inject(String) protected dialogWidth?: string | null,
    @Inject(String) protected dialogHeight?: string | null,

    ) { }

  abstract getRegisterComponent(): any;
  abstract getId(resource: T): number;
  abstract setCloseDialog(response: boolean): any;

  openDialog(resource?: any) {
    let subtitle: string = '';
    let type: string = '';
    let idCrud: number | null = null;
    if (resource === undefined) {
      subtitle = 'Registro';
      type = 'R';
    } else if (resource !== null) {
      subtitle = 'Edición';
      type = 'E';
      idCrud = this.getId(resource) || null;
    }
    this.dialog?.open(this.getRegisterComponent(), {
        width: this.dialogWidth || '800px',
        height: String(this.dialogHeight) || '350px',
        disableClose: true,
        data: {
          subtitle: subtitle,
          type: type,
          idCrud: idCrud,
        },
      })
      .afterClosed().subscribe((response) => {
        //console.log('aquiii', response);
        this.setCloseDialog(response);
        //if (response) { this.genericList(); }
      });
  }


  genericEdit(resource: T) {
    if (resource !== null) {
        //switch (this.crudType) {
           // case CrudTypeEnum.OPEN_DIALOG:
                this.openDialog(resource);
              //  break;
           // case CrudTypeEnum.NEW_TAB:
               // this.openTab(resource);
              //  break;
        //}
    } else {
        //this.messageUtilService?.getAlertWarning(`El registro seleccionado ya no se encuentra registrado.`);
        //this.genericList();
    }
  }
}
