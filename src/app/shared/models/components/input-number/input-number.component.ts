import { Component, OnInit, SkipSelf, Input, EventEmitter, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class InputNumberComponent implements OnInit {

  @Input() label!: String;
  @Input() controlName!: string;
  @Input() maxlength!: number;
  @Input() minlength!: number;
  @Output() change = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  isNumeric(val:any){
    return !isNaN(Number(val.key));
  }

  onChangeCustom(event: any): void {
    //if (this.selectCustom) {
    if (event && event !== null) {
      this.change.emit(event);
    }
    //	}
  }
}
