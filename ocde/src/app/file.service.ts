import { Injectable } from '@angular/core';
import { File } from './file';
import { RenameFile } from './renameFile';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  /**
   * Provides access to multiple API endpoints
   * The service names are quite self explanatory
   */

  postUrl = 'http://127.0.0.1:8000/api/display';
  renameUrl = 'http://127.0.0.1:8000/api/rename';

  constructor(private http : HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };

  /**
   * @returns File details sent to post
   */
  saveFile(input: File, username: String, dirk: String): Observable<File>{
    const url = `${this.postUrl}/${username}/${dirk}`;
    return this.http.post<File>(url,input,this.httpOptions);
  }

  /**
   * @returns List of all files and folders in immediate subdirectory of dirk
   */
  getFiles(username: String, dirk: String): Observable<File[]> {
    const url = `${this.postUrl}/${username}/${dirk}`;
    console.log(url);
    return this.http.get<File[]>(url);
  }

  /**
   * @returns Content of file at given path
   */
  getFile(id: String, username: String, dirk: String): Observable<File> {
    const url = `${this.postUrl}/${username}/${dirk}/${id}`;
    return this.http.get<File>(url)
  }

  /**
   * @returns File details sent to delete
   */
  deleteFile(id: String, username: String, dirk: String): Observable<File> {
    const url = `${this.postUrl}/${username}/${dirk}/${id}`;
    console.log(url);
    return this.http.delete<File>(url);
  }

  /**
   * @returns File object containing success status
   */
  deleteFolder(username: String, dirk: String): Observable<File> {
    const url = `${this.postUrl}/${username}/${dirk}`;
    console.log(url);
    return this.http.delete<File>(url);
  }

  /**
   * @returns File details sent to post
   */
  renameFile(input: RenameFile, dirk: string, username:string): Observable<RenameFile>{
    const url = `${this.renameUrl}/${username}/${dirk}`;
    console.log(input);
    return this.http.post<RenameFile>(url,input,this.httpOptions);
  }
}
