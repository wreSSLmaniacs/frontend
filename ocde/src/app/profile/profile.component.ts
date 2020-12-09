import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../competition.service';
import { LoginService } from "../login.service";
import { ProfileService } from '../profile.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  /**Description
   * Created the profile component, to display the profile page of the website.
   */
  user: String;
  userDet: any;
  image: String;
  points: number = 0;
  email: String;
  date_joined: String;
  is_staff: Boolean;
  first_name: String;
  last_name: String;
  /**Description
   * Constructor to create the instances of the services required.
   * @param uservice Used to fetch user details is of Loginservice instance.
   * @param cpservice Used to fetch the points is of Competition service instance.
   * @param profileservice Used to fetch all the profile details of the logged in user.
   */
  constructor(
    private uservice: LoginService,
    private cpservice: CompetitionService,
    private profileservice: ProfileService
  ) { }
  
  /**Description
   * Quite self-explanatory. Three GET requests to corresponding APIs to get the details of the users and the required display properties.
   */
  ngOnInit(): void {
    this.user = this.uservice.getUser();
    this.profileservice.getUserDetail(this.user)
      .subscribe(data => {
        this.image = data.image;
        this.userDet = data.user_fk;
        this.email = this.userDet.email;
        this.date_joined = this.userDet.date_joined;
        this.is_staff = this.userDet.is_staff;
        this.first_name = this.userDet.first_name;
        this.last_name = this.userDet.last_name;
      });
      this.cpservice.fetchPoints().subscribe(
        (pts) => this.points=pts
      );
  }

}
