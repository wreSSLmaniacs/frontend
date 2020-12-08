import { Injectable,Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from './login.service';



@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector) { }

  intercept(req,next){
    let logser = this.injector.get(LoginService);
    if(localStorage.getItem('token')){
        req   = req.clone({
        setHeaders: {
          Authorization: `token ${logser.getToken()}`
        }
      })
    }
    return next.handle(req);
  }
}
