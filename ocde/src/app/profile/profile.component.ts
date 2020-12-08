import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../competition.service';
import { LoginService } from "../login.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: String;
  image: String;
  points: number = 0;

  constructor(
    private uservice: LoginService,
    private cpservice: CompetitionService
  ) { }

  ngOnInit(): void {
    this.user = this.uservice.getUser();
    this.image = localStorage.getItem('userimage');
    this.cpservice.fetchPoints().subscribe(
      (pts) => this.points=pts
    );
  }

}
