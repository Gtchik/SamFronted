import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Step } from "../models/Step.model";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
  })
export class StepService{
    stepLink = "/step"
    constructor(private http: HttpClient,
                private auth: AuthService){ }

    createNew(step: Step){
        return new Promise<void>((resolve, reject) => {
            this.http.post(
              environment.backServer + this.stepLink +'/new',
              step)
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

    findAllByMission(mission: string) {
  return new Promise<any[]>((resolve, reject) => {
      this.CheckedByUser(mission).then(
        (checkedSteps)=>{
            this.findAllByMissionHttp(mission).then(
              (res: Step[])=>{
                let steps: any[] = [];
                for(let resStep of res){
                  steps.push(
                    {
                      key: resStep._id,
                      icon: resStep.icon,
                      title: resStep.title,
                      stepNumber: resStep.stepNumber,
                      method: resStep.method,
                      tools:resStep.tools,
                      isChecked:checkedSteps.includes(resStep._id),
                      isExpanded: false,
                      isOver: false
                    }
                  )
                } 
                console.log(steps);
                
                resolve(steps)
              }
            ).catch(
              (e)=>{console.log(e);}
            );
            });
        }
      )
      
    }

    findAllByMissionHttp(mission: string){
        return new Promise<Step[]>((resolve, reject) => {
            (this.http.get(
              environment.backServer + this.stepLink + '/mission/' + mission ) as Observable<Step[]>)
              .subscribe(
                (res: Step[]) => {
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
        this.http.delete(environment.backServer + this.stepLink + '/' + id).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
    
    edit(id: string, step: Step) {
      return new Promise((resolve, reject) => {
        this.http.put(environment.backServer + this.stepLink +'/' + id, step).subscribe(
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
      return new Promise<Step>((resolve, reject) => {
        (this.http.get(
          environment.backServer + this.stepLink + '/' + id) as Observable<Step>)
          .subscribe(
            (res: Step) => {
                console.log(res)
                resolve(res)
            },
            (error) => {
              reject(error);
            }
          );
      }); 
    }

    CheckedByUser(missionId: string){
      let userId = this.auth.getUserId();
      return new Promise<string[]>((resolve, reject) => {
        (this.http.get(
          environment.backServer + this.stepLink + '/mission/' + missionId + '/check/' + userId) as Observable<string[]>)
          .subscribe(
            (res: string[]) => {
                console.log(res)
                resolve(res)
            },
            (error) => {
              reject(error);
            }
          );
      }); 
    }

    CheckStep(stepId: string, missionId: string){
      let userId = this.auth.getUserId();
      return new Promise<void>((resolve, reject) => {
        let req = {
          userId: userId,
          stepId: stepId,
          missionId: missionId
        }
        this.http.post(
          environment.backServer + this.stepLink +'/check',
          req)
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
}