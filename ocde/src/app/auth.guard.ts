import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
/**Description
 * An essential class that implements CanActivate from router module.
 * This class been used to prevent the acess of the rest of the site to the user until the user is logged in.
 */
export class AuthGuard implements CanActivate {

  /**
   * Constructor instantiates required services
   * @param _login To call the functions of login service class
   * @param _router To call the functions of router class
   */
  constructor(private _login:LoginService, private _router:Router){}

  /**
   * The user can activate the component url only if this function returns True, which is determined using a function from loginservice.
   */
  canActivate():boolean{
    if(this._login.loggedIn()){
      return true
    }
    else{
      this._router.navigate(['/login'])
      return false
    }
  }
}
