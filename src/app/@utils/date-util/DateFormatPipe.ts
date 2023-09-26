import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DateFormatPipe {

  date = new Date();

  constructor(private datePipe: DatePipe) {}

  formatDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  getFirstDayOfMonth() {
    const date = this.formatDate(this.date, 'yyyy-MM-dd');
    const [year, month, day] = date!.split('-');
    const date_desde = new Date(+year, +month - 1, 1); //Fecha del primer día del mes
    return date_desde;
  }

  getLastDayOfMonth() {
    const date = this.formatDate(this.date, 'yyyy-MM-dd');
    const [year, month, day] = date!.split('-');
    const date_hasta = new Date(Number(year), Number(month), 0); //Fecha del último día del mes
    return date_hasta;
  }

  getYear() {
    return this.date.getFullYear();
  }
}
