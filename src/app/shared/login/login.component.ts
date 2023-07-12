import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit() {
    console.warn("Login");
  }

  public ingresar(){
    console.log("click");
    this.router.navigate(['./nav']);


  }
  hide = true;


}
