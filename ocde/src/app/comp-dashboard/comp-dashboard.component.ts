import { Component, OnInit } from '@angular/core';
import { CompetitionService } from "../competition.service";
import { Comp } from "../comp"

@Component({
  selector: 'app-comp-dashboard',
  templateUrl: './comp-dashboard.component.html',
  styleUrls: ['./comp-dashboard.component.scss']
})
export class CompDashboardComponent implements OnInit {

  comps : Comp[] = [];
  
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

  initCompetition(x: number) {
    localStorage.setItem('running',x.toString());
  }

}