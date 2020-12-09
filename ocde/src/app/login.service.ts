import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './login/user';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
/**Description
 * A class that has been used to define various functions that place the API calls.
 */
export class LoginService {
  postUrl = 'http://127.0.0.1:8000/api/login'
  firstry = 'http://127.0.0.1:8000/auth/'

  /**Description
   * Constructor creates two instances
   * @param http  An instance of a HttpClient class
   * @param _router An instance of the Router class
   */
  constructor(private http:HttpClient,private _router:Router) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };
  /**Description
   * Function to get the token which will be used in site authentication
   * @param user Takes the login details as the input
   */
  trytoken(user:User):Observable<any>{
    return this.http.post(this.firstry, user, this.httpOptions)
  }
  /**
   * Function used to fetch the details of the logined user
   * @param user The details of the user
   */
  trylogin(user:User):Observable<User>{
    return this.http.post<User>(this.postUrl, user, this.httpOptions)
  }
  /**
   * Function that returns whether the user is currently logged in using the token
   */
  loggedIn(){
    return !!localStorage.getItem('token');
  }
  /**
   * Function that logs out the user and deletes all the items stored in local storage
   */
  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userimage');
    localStorage.removeItem('userid');
    this._router.navigate(['/home']);
  }
  /**
   * Function to get the token stored in local storage
   */
  getToken(){
    return localStorage.getItem('token');
  }
  /**
   * Function to get the username stored in local storage
   */
  getUser() {
    return localStorage.getItem('username');
  }
  /**
   * Function to get the userimage stored in local storage
   */
  getImage(){
    return localStorage.getItem('userimage');
  }
  /**
   * Function to get the userid stored in local storage
   */
  getUserId(){
    return localStorage.getItem('userid');
  }
}
