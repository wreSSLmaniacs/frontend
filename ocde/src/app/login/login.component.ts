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
  notsuccess :string="";
  
  loginForm = new FormGroup({
    username:new FormControl('', Validators.required),
    password:new FormControl('',Validators.required)
  })

  constructor(
    private logserv:LoginService,
    private _router:Router,
    private locallogserv:LoginService,
  ) { }

  ngOnInit(): void {
    
  }

  localcall(){
    this.locallogserv.trylogin(this.myuser).subscribe(
      (res:any)=>{
        localStorage.setItem('userimage',res.image);
        localStorage.setItem('userid',res.userid);
      },
      err=>{
        console.log(err);
      }
    )
  }

  onSubmit(){
    this.myuser={
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }

    this.logserv.trytoken(this.myuser)
      .subscribe(
        (res:any) => {
          // console.log(res)
          this.notsuccess ="";
          this.localcall();
          localStorage.setItem('token',res.token);
          // localStorage.setItem('userimage',res.image);
          // localStorage.setItem('userid', res.userid);
          localStorage.setItem('username',this.myuser.username);
          this._router.navigate(['/profile']);
        },
        err => {
          this.notsuccess = "fail";
          console.log(err);

        }
      )
  }

}
