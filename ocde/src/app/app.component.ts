import { Component } from '@angular/core';
import { LoginService } from './login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/**
 * The root component of the project which has all the other components as a part of it
 */
export class AppComponent {
  /**Title remains same throughout the site */
  title = 'ocde';

  constructor(public _loginserv:LoginService){}
}
