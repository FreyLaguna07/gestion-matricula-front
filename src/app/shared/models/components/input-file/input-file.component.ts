import { Component, OnInit, Input, SkipSelf, Output, EventEmitter } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class InputFileComponent implements OnInit {

  @Input() label!: String;
  @Input() controlName!: string;
  @Input() accept!: string;
  @Output() change = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  disabled: boolean = false;
  multiple: boolean = false;


  onChangeCustom(event: any): void {
    //if (this.selectCustom) {
    if (event && event !== null) {
      this.change.emit(event);
    }
    //	}
  }
}
