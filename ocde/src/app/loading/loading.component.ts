import { Component, OnInit } from '@angular/core';

/**
 * This component performs the basic task of providing a loading screen
 */

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
