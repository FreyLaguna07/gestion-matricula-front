import { Component, OnInit, Input, SkipSelf, Output, EventEmitter } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class InputTextComponent implements OnInit {

  @Input() label!: String;
  @Input() disabled!: boolean;
  @Input() readonly!: boolean;
  @Input() controlName!: string;
  @Output() change = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  onChangeCustom(event: any): void {
    //if (this.selectCustom) {
    if (event && event !== null) {
      this.change.emit(event);
    }
    //	}
  }

}
