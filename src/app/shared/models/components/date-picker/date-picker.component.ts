import { Component, OnInit, Input, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ],
})
export class DatePickerComponent implements OnInit {

  @Input() label!: String;
  @Input() controlName!: string;
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }


  ngOnInit() {
  }

}
