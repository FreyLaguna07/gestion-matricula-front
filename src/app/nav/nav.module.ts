import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavRoutingModule } from './nav-routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NavRoutingModule,
    //MaterialModule,
    //PrimengModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule

   ],
  exports: [NavRoutingModule],
  providers: [],
})
export class NavModule {}
