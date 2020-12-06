import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-dashboard',
  templateUrl: './comp-dashboard.component.html',
  styleUrls: ['./comp-dashboard.component.scss']
})
export class CompDashboardComponent implements OnInit {

  comps = [
    {
      "title":"Competition 1",
      "body":"This competition has a moderate difficulty level and focusses on fast fourier transforms",
      "url":"/profile"
    }
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
