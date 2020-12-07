import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-comp-dashboard',
  templateUrl: './comp-dashboard.component.html',
  styleUrls: ['./comp-dashboard.component.scss']
})
export class CompDashboardComponent implements OnInit {

  comps = [];
  
  constructor(
    private cpservice : CompetitionService
  ) { }

  ngOnInit(): void {
    this.cpservice.fetchCompetetions().subscribe(
      running => {
        this.comps = running;
        alert("New competitions loaded!!")
      }
    );
  }

}