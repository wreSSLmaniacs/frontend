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
    username:new FormControl('', Validators.required),
    password:new FormControl('',Validators.required)
  })

  constructor(
    private logserv:LoginService,
    private _router:Router,
  ) { }

  ngOnInit(): void {
    
  }

  onSubmit(){
    this.myuser={
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }

    this.logserv.trylogin(this.myuser)
      .subscribe(
        (res:any) => {
          // console.log(res)
          localStorage.setItem('token',res.token);
          localStorage.setItem('username',this.myuser.username);
          this._router.navigate(['/profile']);
        },
        err => console.log(err)
      )
  }

}
