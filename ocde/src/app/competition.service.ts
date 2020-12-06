import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Comp } from './comp';

@Injectable({
  providedIn: 'root'
})

export class CompetitionService {

  postUrl = 'http://127.0.0.1:8000/api/-fill-here-';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  fetchCompetetions() : Observable<Comp[]> {
    return this.http.post<Comp[]>(this.postUrl,this.httpOptions);
  }

}