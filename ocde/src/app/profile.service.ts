import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { Profile } from './profile/profile'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  getUrl = 'http://127.0.0.1:8000/api/profile/'
  getUserUrl = 'http://127.0.0.1:8000/api/profile/pk'

  constructor(private http:HttpClient,private _router:Router) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };

  getUser(){
    return this.http.post<Profile>(this.getUrl, this.httpOptions)
  }

  getUserDetail(username : String){
    console.log({'username':username})
    return this.http.post<Profile>(this.getUserUrl, {'username': username}, this.httpOptions)
  }
}
