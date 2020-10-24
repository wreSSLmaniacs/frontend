import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myuser : User;

  loginForm = new FormGroup({
    useremail:new FormControl('', Validators.required),
    password:new FormControl('',Validators.required)
  })

  constructor(private logserv:LoginService, private _router:Router) { }

  ngOnInit(): void {
    
  }

  onSubmit(){
    this.myuser={
      email: this.loginForm.get('useremail').value,
      password: this.loginForm.get('password').value
    }

    this.logserv.trylogin(this.myuser)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token',"Active")
          this._router.navigate(['/profile']);
        },
        err => console.log(err)
      )
    console.log(this.myuser);
  }

}
