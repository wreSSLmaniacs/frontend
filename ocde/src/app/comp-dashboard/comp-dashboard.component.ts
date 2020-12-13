import { Component, OnInit } from '@angular/core';
import { CompetitionService } from "../competition.service";
import { Comp } from "../comp"

/**
 * This component renders the three types of competitions :
 * 1. Running
 * 2. Upcoming
 * 3. Past
 * and provides link to appropriate pages.
 * It uses TimerComponent as a child component.
 */

@Component({
  selector: 'app-comp-dashboard',
  templateUrl: './comp-dashboard.component.html',
  styleUrls: ['./comp-dashboard.component.scss']
})

export class CompDashboardComponent implements OnInit {

  upcoming: String = "start:";
  running: String = "end:";

  rcomps : Comp[] = [];
  ucomps : Comp[] = [];
  pcomps : Comp[] = [];
  load: boolean= true;
  
  constructor(
    private cpservice : CompetitionService
  ) { }

  ngOnInit(): void {
    this.cpservice.fetchRunningCompetetions().subscribe(
      running => {
        this.rcomps = running;
      }
    );
    this.cpservice.fetchUpcomingCompetetions().subscribe(
      running => {
        this.ucomps = running;
        this.load = false;
      }
    );
    this.cpservice.fetchPastCompetetions().subscribe(
      running => {
        this.pcomps = running;
      }
    );
  }
}