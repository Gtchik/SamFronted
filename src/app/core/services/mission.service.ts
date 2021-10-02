import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Mission } from "../models/Mission.model";

@Injectable({
    providedIn: 'root'
  })
export class MissionService{
    missionLink = "/mission"
    constructor(private http: HttpClient){ }

    createNew(mission: Mission){
        return new Promise<void>((resolve, reject) => {
            this.http.post(
              environment.backServer + this.missionLink +'/new',
              mission)
              .subscribe(
                () => {
                    resolve()
                },
                (error) => {
                  reject(error);
                }
              );
          }); 
    }

    findAll(){
        return new Promise<Mission[]>((resolve, reject) => {
            (this.http.get(
              environment.backServer + this.missionLink) as Observable<Mission[]>)
              .subscribe(
                (res: Mission[]) => {
                    console.log(res)
                    resolve(res)
                },
                (error) => {
                  reject(error);
                }
              );
          }); 
    }
    
    delete(id:string){
      return new Promise((resolve, reject) => {
        this.http.delete(environment.backServer + this.missionLink + '/' + id).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
    
    edit(id: string, mission: Mission) {
      return new Promise((resolve, reject) => {
        this.http.put(environment.backServer + this.missionLink +'/' + id, mission).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }

    findOneById(id: string){
      return new Promise<Mission>((resolve, reject) => {
        (this.http.get(
          environment.backServer + this.missionLink + '/' + id) as Observable<Mission>)
          .subscribe(
            (res: Mission) => {
                console.log(res)
                resolve(res)
            },
            (error) => {
              reject(error);
            }
          );
      }); 
    }
}