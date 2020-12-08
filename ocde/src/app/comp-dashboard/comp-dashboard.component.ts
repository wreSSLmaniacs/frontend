import { Component, OnInit } from '@angular/core';
import { CompetitionService } from "../competition.service";
import { Comp } from "../comp"

@Component({
  selector: 'app-comp-dashboard',
  templateUrl: './comp-dashboard.component.html',
  styleUrls: ['./comp-dashboard.component.scss']
})
export class CompDashboardComponent implements OnInit {

  rcomps : Comp[] = [];
  ucomps : Comp[] = [];
  pcomps : Comp[] = [];
  
  constructor(
    private cpservice : CompetitionService
  ) { }

  ngOnInit(): void {
    this.cpservice.fetchRunningCompetetions().subscribe(
      running => {
<<<<<<< HEAD
        this.comps = running;
        alert("New competitions loaded!!")
      }
    );
=======
        this.rcomps = running;
      }
    );
    this.cpservice.fetchUpcomingCompetetions().subscribe(
      running => {
        this.ucomps = running;
      }
    );
    this.cpservice.fetchPastCompetetions().subscribe(
      running => {
        this.pcomps = running;
      }
    );
>>>>>>> competetions
  }

  initCompetition(x: number) {
    localStorage.setItem('running',x.toString());
  }

}