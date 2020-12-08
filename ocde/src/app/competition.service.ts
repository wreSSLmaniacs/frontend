import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Comp } from './comp';

@Injectable({
  providedIn: 'root'
})

export class CompetitionService {

  postUrl = 'http://127.0.0.1:8000/api/contest/postcontest';
  getRUrl = 'http://127.0.0.1:8000/api/contest/get/running';
  getUUrl = 'http://127.0.0.1:8000/api/contest/get/upcoming';
  getPUrl = 'http://127.0.0.1:8000/api/contest/get/past';
  getUrl = 'http://127.0.0.1:8000/api/competition'
  submitCodeUrl = 'http://127.0.0.1:8000/api/submit/code'
  submitFileUrl = 'http://127.0.0.1:8000/api/submit/file'

  constructor(private http : HttpClient) { }

  fetchRunningCompetetions() : Observable<Comp[]> {
    return this.http.get<Comp[]>(this.getRUrl);
  }

  fetchUpcomingCompetetions() : Observable<Comp[]> {
    return this.http.get<Comp[]>(this.getUUrl);
  }

  fetchPastCompetetions() : Observable<Comp[]> {
    return this.http.get<Comp[]>(this.getPUrl);
  }

  regContest(formData) {
    return this.http.post<any>(this.postUrl,formData);
  }

  fetchCompetitionbyId(index) : Observable<Comp> {
    return this.http.get<Comp>(`${this.getUrl}/${index}`);
  }

  submitCode(id,code) : Observable<String> {
    return this.http.post<String>(`${this.submitCodeUrl}/${id}`,code);
  }

  submitFile(id,code) : Observable<String> {
    return this.http.post<String>(`${this.submitFileUrl}/${id}`,code);
  }

}