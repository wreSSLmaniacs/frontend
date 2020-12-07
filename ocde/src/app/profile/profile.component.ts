import { Component, OnInit } from '@angular/core';
import { LoginService } from "../login.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: String;
  image: String;

  constructor(
    private uservice: LoginService
  ) { }

  ngOnInit(): void {
    this.user = this.uservice.getUser();
    this.image = localStorage.getItem('userimage')
  }

}
