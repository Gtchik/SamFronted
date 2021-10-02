import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable(
      (observer: any) => {
        this.auth.isAuth$.subscribe(
          (auth) => {
            console.log(auth);
            if (!auth) {
              // this.auth.loginByStorage().then(
              //   ()=>{},
              //   ()=>{
              //     this.router.navigate(['login'], { queryParams: { returnUrl: state.url }})
              //   }).catch((error)=>{
              //     console.log(error);                  
              //    this.router.navigate(['login'], { queryParams: { returnUrl: state.url }})
              // });
              this.router.navigate(['login'], { queryParams: { returnUrl: state.url }})
            }
            observer.next(true);
          }
        );
      }
    );
  }
}
