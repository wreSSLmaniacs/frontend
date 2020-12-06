import { Component, OnInit } from '@angular/core';
import { UsernameService } from "../username.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: String;

  constructor(
    private uservice: UsernameService
  ) { }

  ngOnInit(): void {
    this.user = this.uservice.getUser();
  }

}
