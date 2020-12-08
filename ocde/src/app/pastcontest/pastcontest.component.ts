import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-pastcontest',
  templateUrl: './pastcontest.component.html',
  styleUrls: ['./pastcontest.component.scss']
})
export class PastcontestComponent implements OnInit {

  id: number;
  startexecution: Boolean = false;

  passed: Boolean = false;
  points: number;

  title: String;
  body: String;

  gotContest: Boolean = false;
  gotPoints: Boolean = false;

  constructor(
    private cpservice : CompetitionService,
    private route : ActivatedRoute
  ) {
    this.route.params.subscribe(
      (params) => {
        this.id = params.id;
        this.startexecution = true;
      }
    )
  }

  ngOnInit(): void {
    while(!this.startexecution) {;}
    this.cpservice.fetchCompetitionbyId(this.id).subscribe(
      (comp) => {
        this.title = comp.title;
        this.body = comp.problem;
        this.gotContest = true;
      }
    );
    this.cpservice.contestPassed(this.id).subscribe(
      (res) => {
        this.passed = res.passed;
        this.points = res.points;
        this.gotPoints = true;
      }
    );
  }

  loaded(): Boolean {
    return this.gotContest && this.gotPoints;
  }

}
