import { Component, OnInit, Input, Output, EventEmitter,HostBinding, SkipSelf, forwardRef, Provider, Self, OnDestroy, AfterViewInit } from '@angular/core';

import { FormControl,ControlContainer,ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";

const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgSelectSimpleComponent),
  multi: true,
};

@Component({
  selector: 'ng-select-simple',
  templateUrl: './ng-select-simple.component.html',
  styleUrls: ['./ng-select-simple.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class NgSelectSimpleComponent implements OnInit, OnDestroy {
  @Input() label!: String;
  @Input() item!: any;
  @Input() markFirstItem: boolean = false;
  @Input() controlName!: string;
  //@Inject(String) protected dialogWidth?: string | null
  setValueSelect: any;

  @Output() change = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
      this.markFirstItemSelect();
  }

  markFirstItemSelect() {
    if (this.markFirstItem && this.item) {
      this.item.subscribe((element: any) => {
        console.log("this.controlName",this.controlName);

        this.setValueSelect = element[0].value;
        this.onChangeSelectCustom(element[0]);
      });
    }
  }

  onChangeSelectCustom(event: any): void {
    //if (this.selectCustom) {
    if (event && event !== null) {
      this.change.emit(event);
    }
    //	}
  }

  ngOnDestroy(): void {
    this.item.subscribe();
  }
}
