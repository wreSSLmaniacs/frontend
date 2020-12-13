import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { LoginService } from '../login.service';

/**
 * This component is the login system for our website.
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  myuser : User; /**< Implements User interface and creates an instance */
  notsuccess :string=""; /**A variable to store if the login was a success */

  /**
   * A Formgroup created that will be send through the POST request
   */
  
  loginForm = new FormGroup({
    username:new FormControl('', Validators.required), 
    password:new FormControl('',Validators.required)
  })

  /**
   * We define the constructor of the class hear
   * @param logserv An instance of class login service
   * @param _router An instance of the class router
   * @param locallogserv Another instacne of login service
   */

  constructor(
    private logserv:LoginService,
    private _router:Router,
    private locallogserv:LoginService,
  ) { }

  ngOnInit(): void {
    
  }
  /**
   * This function will fetch the userid and the userimage after a authenticated login is made.
   */
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
  /**
   * This function is to submit the form to the backend. We are also storing the username and the password of this user in myuser variable. This variable is sent through the POST request.
   */
  onSubmit(){
    this.myuser={
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    }

    /**
     * We are trying to make an API call and get a token, with the obtained token we are storing it in local storage, so that we can further use this token to authenticate further API calls.
     */

    this.logserv.trytoken(this.myuser)
      .subscribe(
        (res:any) => {
          // console.log(res)
          this.notsuccess ="";
          /**
           * This local call function is to fetch the login details of the user after the token has been obtained.
           */
          this.localcall();
          localStorage.setItem('token',res.token);
          // localStorage.setItem('userimage',res.image);
          // localStorage.setItem('userid', res.userid);
          localStorage.setItem('username',this.myuser.username);
          this._router.navigate(['/profile']);
        },
        err => {
          // this.notsuccess = "fail";
          alert("Invalid credentials. Try Again!")
          console.log(err);

        }
      )
  }

}
