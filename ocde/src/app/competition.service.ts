import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Comp } from './comp';
import { Contest } from "./contest";

@Injectable({
  providedIn: 'root'
})

export class CompetitionService {

  postUrl = 'http://127.0.0.1:8000/api/contest/postcontest';
  getallUrl = 'http://127.0.0.1:8000/api/contest/getall';
  getUrl = 'http://127.0.0.1:8000/api/competition'

  constructor(private http : HttpClient) { }

  fetchCompetetions() : Observable<Comp[]> {
    return this.http.get<Comp[]>(this.getallUrl);
  }

  regContest(formData) {
    return this.http.post<any>(this.postUrl,formData);
  }

  fetchCompetitionbyId(index) : Observable<Comp> {
    return this.http.get<Comp>(`${this.getUrl}/${index}`);
  }

}