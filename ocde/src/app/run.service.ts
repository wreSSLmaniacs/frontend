import { Injectable } from '@angular/core';
import { RunInput } from './run_input';
import { RunOutput } from './run_output';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  postUrl = 'http://127.0.0.1:8000/api/compile';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  runScript(input : RunInput) : Observable<RunOutput> {
    return this.http.post<RunOutput>(this.postUrl,input,this.httpOptions);
  } 

}
