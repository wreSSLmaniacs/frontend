import { Injectable,Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from './login.service';



@Injectable({
  providedIn: 'root'
})

/**
 * An important class for the frontend part of the authentication of the website.
 * The injectable class Tokeninterceptor implements HttpInterceptor class.
 */

export class TokenInterceptorService implements HttpInterceptor{
  /**
   * Constructor to create an injector
   * @param injector To prevent a cyclic dependancy we use this injector
   */

  constructor(private injector: Injector) { }
  /**
   * This fucntion intercepts all the http calls that the frontend makes
   * @param req Takes the incoming request
   * @param next Used to pass on to the next interceptor if present, in our case none.
   */
  intercept(req,next){
    let logser = this.injector.get(LoginService);
    /**
     * If the token is set then, that means the token has been obtained after login, we will try to clone the request to not tamper with the original request.
     * To the cloned request we add a authization header with the appended unique token of the user, which makes our requests authorized.
     */
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
