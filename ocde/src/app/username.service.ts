import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  userName : String;

  constructor() { }

  regUser(userId: String) {
    this.userName = userId;
  }

  getUser() {
    return this.userName;
  }
}
