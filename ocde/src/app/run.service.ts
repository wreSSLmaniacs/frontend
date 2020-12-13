import { Injectable } from '@angular/core';
import { RunInput } from './run_input';
import { RunOutput } from './run_output';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  /**
   * Provides access to compiling API endpoint for compile and execution of code
   * The service names are quite self explanatory
   */

  postUrl = 'http://127.0.0.1:8000/api/compile';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  runScript(input : RunInput, username:string, dirk: string) : Observable<RunOutput> {
    const url = `${this.postUrl}/${username}/${dirk}`;
    console.log(input);
    return this.http.post<RunOutput>(url,input,this.httpOptions);
  }

  runFile(infile : FormData, username:string, dirk: string) : Observable<RunOutput> {
    const url = `${this.postUrl}/${username}/${dirk}`;
    return this.http.post<RunOutput>(url,infile,this.httpOptions);
  }

}
