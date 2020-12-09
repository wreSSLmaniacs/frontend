import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

/** Description
 * This component performs the basic task of providing a loading screen
 */
export class LoadingComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
