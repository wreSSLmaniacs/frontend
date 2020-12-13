import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { Profile } from './profile/profile'

@Injectable({
  providedIn: 'root'
})
/**
 * A class that has been used to make two service requests- The service to get the user and the service to get the details
 */
export class ProfileService {
  getUrl = 'http://127.0.0.1:8000/api/profile/'
  getUserUrl = 'http://127.0.0.1:8000/api/profile/pk'

  constructor(private http:HttpClient,private _router:Router) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };

  /**
   * Function has been used to make a POST request and return the profile of the user.
   */
  getUser(){
    return this.http.post<Profile>(this.getUrl, this.httpOptions)
  }

  /**
   * Function has been used to make a POST request and return the details of the user to display in the profile.
   */
  getUserDetail(username : String){
    console.log({'username':username})
    return this.http.post<Profile>(this.getUserUrl, {'username': username}, this.httpOptions)
  }
}
