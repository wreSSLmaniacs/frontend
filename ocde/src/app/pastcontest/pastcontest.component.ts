import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompetitionService } from '../competition.service';

/**Description
 * This component lets a user view the contests that are over
 * It displays the problem statement along with their status
 * (solved/unsolved) and points obtained 
 */

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

  /**
  * Rendering is done via Angular's parametrized routes
  */
  constructor(
    private cpservice: CompetitionService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(
      (params) => {
        this.id = params.id;
        this.startexecution = true;
      }
    )
  }

  /**
   * The loop prevents execution till the id is obtained
   * This id is needed in backend requests
   */
  ngOnInit(): void {

    while (!this.startexecution) { ; }

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

  /**
   * A simple boolean function to know the status of requests
   * Used for loading screen rendering
   */
  loaded(): Boolean {
    return this.gotContest && this.gotPoints;
  }

}
