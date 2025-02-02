import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './login/user';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  postUrl = 'http://127.0.0.1:8000/api/login'
  firstry = 'http://127.0.0.1:8000/auth/'

  constructor(private http:HttpClient,private _router:Router) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };

  trytoken(user:User):Observable<any>{
    return this.http.post(this.firstry, user, this.httpOptions)
  }

  trylogin(user:User):Observable<User>{
    return this.http.post<User>(this.postUrl, user, this.httpOptions)
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userimage');
    localStorage.removeItem('userid');
    this._router.navigate(['/home']);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getUser() {
    return localStorage.getItem('username');
  }

  getImage(){
    return localStorage.getItem('userimage');
  }

  getUserId(){
    return localStorage.getItem('userid');
  }
}
