import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  /**Description
   * This is the homepage of our website.
   * It is publicly accessible and API free, which make it completely fast and suitable for our users.We have our team details, some resources and key features of the project are listed on the homepage.
   */
  
  ngOnInit(): void {
  }

}
