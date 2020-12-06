import { Injectable } from '@angular/core';
import { File } from './file';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  postUrl = 'http://127.0.0.1:8000/api/display';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  saveFile(input: File, username: String, dirk: String): Observable<File>{
    const url = `${this.postUrl}/${username}/${dirk}`;
    return this.http.post<File>(url,input,this.httpOptions);
  }

  getFiles(username: String, dirk: String): Observable<File[]> {
    const url = `${this.postUrl}/${username}/${dirk}`;
    return this.http.get<File[]>(url);
  }

  getFile(id: String, username: String, dirk: String): Observable<File> {
    const url = `${this.postUrl}/${username}/${dirk}/${id}`;
    return this.http.get<File>(url)
  }

  deleteFile(id: String, username: String, dirk: String): Observable<File> {
    const url = `${this.postUrl}/${username}/${dirk}/${id}`;
    return this.http.delete<File>(url);
  }

  deleteFolder(username: String, dirk: String): void {
    const url = `${this.postUrl}/${username}/${dirk}`;
    this.http.delete(url);
  }
}
