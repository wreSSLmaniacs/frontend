import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUser } from './register/newuser';

@Injectable({
  providedIn: 'root'
})
export class RegService {
  postUrl = 'http://127.0.0.1:8000/api/profile/add'
  constructor(private http:HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json'})
  };

  tryreg(user:NewUser):Observable<NewUser>{
    return this.http.post<NewUser>(this.postUrl, user, this.httpOptions)
  }
}
