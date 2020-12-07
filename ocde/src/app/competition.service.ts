import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Comp } from './comp';
import { Contest } from "./contest";

@Injectable({
  providedIn: 'root'
})

export class CompetitionService {

  postUrl = 'http://127.0.0.1:8000/api/-fill-here-';
  getUrl = 'http://127.0.0.1:8000/api/-fill-here-';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  fetchCompetetions() : Observable<Comp[]> {
<<<<<<< HEAD
    return this.http.get<Comp[]>(this.getUrl,this.httpOptions);
  }

  regContest(contest : Contest) : Observable<String> {
    return this.http.post<String>(this.postUrl,contest,this.httpOptions);
=======
    return this.http.post<Comp[]>(this.postUrl,this.httpOptions);
>>>>>>> master
  }

}