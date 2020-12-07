import { Component, OnInit } from '@angular/core';
import { NewUser } from './newuser'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'

import { RegService } from '../reg.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  mynewuser: NewUser;

  regForm = new FormGroup({
    username:new FormControl('', Validators.required),
    email: new FormControl('',Validators.required),
    password:new FormControl('',Validators.required),
    image:new FormControl('')
  })

  httpOptions = {
    headers: new HttpHeaders ({ 'Content-Type': 'application/json' })
  };

  constructor(private regserv:RegService,private _router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.mynewuser={
      username: this.regForm.get('username').value,
      email: this.regForm.get('email').value,
      password: this.regForm.get('password').value,
      image: this.regForm.get('image').value
    }

    this.regserv.tryreg(this.mynewuser)
      .subscribe(
        res => {
          this._router.navigate(['/login'])
        },
        err => console.log(err)
      )
  }

}
