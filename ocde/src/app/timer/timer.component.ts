import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, interval } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  
  /** Description
   * This component displays the time remaining accurate to seconds for an event
   * Event datetime and type (a string specifying "start"/"end") are passed as @Input parameters
   * The element also refreshes the page when an event expires
   * The code used is essentially a modification of code that can be found at :
   * https://medium.com/javascript-in-plain-english/implement-a-countdown-timer-with-rxjs-in-angular-3852f21a4ea0
   */

  @Input() endsAt;
  @Input() type;

  public dDate;
  private subscription: Subscription;


  constructor(
    /**
     * This is needed for the refresh capability
     */
    private _router: Router
  ) {}

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;


  private getTimeDifference() {
    this.timeDifference = this.dDate.getTime() - new Date().getTime();
    
    /**
     * The logic for refresh on event expiration
     */
    if(this.timeDifference<0) {
      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
      this._router.onSameUrlNavigation = 'reload';
      this._router.navigate(['/dashboard']);
    }
    
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnInit() {
    /**
     * Subscription is used to refresh the timer every second
     */
    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });
    this.dDate = new Date(this.endsAt);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
