import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']
})

export class CompetitionComponent implements OnInit {

  title: String;
  body: String;

  constructor(
    private cpservice: CompetitionService
  ) { }

  ngOnInit(): void {
    this.cpservice.fetchCompetitionbyId(
      localStorage.getItem('running')
    ).subscribe(
      (comp) => {
        this.title = comp.title;
        this.body = comp.problem;
      }
    )
  }

}