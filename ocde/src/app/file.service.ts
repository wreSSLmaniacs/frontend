import { Injectable } from '@angular/core';
import { File } from './file';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  postUrl = 'http://127.0.0.1:8000/api/file';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  saveFile(input: File): Observable<File>{
    return this.http.post<File>(this.postUrl,input,this.httpOptions);
  }
}
