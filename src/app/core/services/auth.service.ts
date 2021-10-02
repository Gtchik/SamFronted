import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  token!: string;
  roles!:string[];
  userId!: string;
  admin!: boolean;
  expiry!: Date;

  constructor(private router: Router,
              private http: HttpClient,
              private message: NzMessageService) {}

  loginByStorage(){
    return new Promise<void>((resolve, reject) =>{
      const token = this.getStorageUser().token; 
      const expiry = this.getStorageUser().expiry;   
      if(token){
        this.expiry = expiry;
        (this.http.post(
          environment.backServer + '/auth/loginbytoken',
          { token: token }) as Observable<{token : string, userId: string, roles: string[] }>).subscribe(
            (authData: { token: string, userId: string, roles: string[] }) => {
              this.token = authData.token;
              this.roles = authData.roles;
              this.userId = authData.userId;
              this.admin = authData.roles.includes('admin');
              console.log(this.admin);
              
              this.isAuth$.next(true);
              resolve()
            },
            (error) => {
              console.log(error);
              reject()
            });
      }else{
        reject()
      }
    });
  }
  
  setStorageUser(userId:string, token:string, TTL: number){
    const key:string = 'loggedUser';
    //TTL is the time to live in minutes
    this.expiry = new Date(Date.now() + TTL*60000);
    localStorage.setItem(key,JSON.stringify({
        token: token,
        expiry: this.expiry
    }));
  }
  getStorageUser():{token:string;expiry:Date;}{
    const key:string = 'loggedUser';
    interface valueJson{
        token:string;
        expiry:Date;
    }
    let value = localStorage.getItem(key);
    if(value){
        const valueJson:valueJson = JSON.parse(value);
        if(new Date(valueJson.expiry) < new Date(Date.now())){
            localStorage.removeItem(key);
            this.message.warning('Vous avez été déconnecté.')
            return {token:"", expiry: new Date(Date.now())};
        }else{
          return valueJson;
        }
    }
    return {token:"", expiry: new Date(Date.now())};
  }

  getToken(){
    return this.token;
  }

  getUserId(){
    return this.userId;
  }

  isExpiry(){
    return this.expiry < new Date(Date.now());
  }

  isRole(role: string){
    return this.roles.includes(role);
  }

  createNewUser(firstName: string, lastName: string, roles: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(
        environment.backServer + '/auth/signup',
        { firstName: firstName, lastName: lastName, roles: roles, stepsChecked: []})
        .subscribe(
          () => {
            this.login(firstName, lastName).then(
              () => {
                resolve();
              }
            ).catch(
              (error) => {
                reject(error);
              }
            );
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  login(firstName: string, lastName: string) {
    return new Promise<void>((resolve, reject) => {
      (this.http.post(
        environment.backServer + '/auth/login',
        { firstName: firstName, lastName: lastName }) as Observable<{token : string, userId: string, roles: string[] }>).subscribe(
          (authData: { token: string, userId: string, roles: string[] }) => {
            this.token = authData.token;
            this.roles = authData.roles;
            this.userId = authData.userId;
            this.admin = authData.roles.includes('admin');
            this.isAuth$.next(true);
            this.setStorageUser(this.userId, this.token, 2*60);
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  logout() {
    this.isAuth$.next(false);
    this.token = "";
    this.userId = "";
    this.roles = [];
    localStorage.removeItem("loggedUser");
  }
}
