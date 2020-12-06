import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LoginService } from '../login.service';
import { UsernameService } from "../username.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myuser : User;

  loginForm = new FormGroup({
    username:new FormControl('', Validators.required),
    password:new FormControl('',Validators.required)
  })

  constructor(
    private logserv:LoginService,
    private _router:Router,
    private uservice: UsernameService
  ) { }

  ngOnInit(): void {
    
  }

  onSubmit(){
    this.myuser={
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    }

    this.uservice.regUser(this.myuser.username);

    this.logserv.trylogin(this.myuser)
      .subscribe(
        (res:any) => {
          console.log(res)
          localStorage.setItem('token',res.token)
          this._router.navigate(['/profile']);
        },
        err => console.log(err)
      )
  }

}
