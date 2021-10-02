import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
              private message: NzMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.authService.isExpiry()){
      this.message.error("Vous avez été déconnécté")
      this.authService.logout();
    }
    const headersConfig = {
        Authorization:""
    };
    const token = this.authService.getToken();
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    
    // const userId = this.authService.getUserId();
    // if(userId){
      
    //   const request = req.clone({ 
    //     setHeaders: headersConfig,
    //     body: { 
    //       ...req.body,
    //       userId: userId
    //     }
    //   });
    //   return next.handle(request);
    // }
    const request = req.clone({ 
      setHeaders: headersConfig
    });
    return next.handle(request);
    

  }
}