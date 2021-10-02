import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Library } from "../models/Library.model";

@Injectable({
    providedIn: 'root'
  })
export class LibraryService{
    libraryLink = "/library"
    constructor(private http: HttpClient){ }

    createNew(library: Library){
        return new Promise<void>((resolve, reject) => {
            this.http.post(
              environment.backServer + this.libraryLink +'/new',
              library)
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
        return new Promise<Library[]>((resolve, reject) => {
            (this.http.get(
              environment.backServer + this.libraryLink) as Observable<Library[]>)
              .subscribe(
                (res: Library[]) => {
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
        this.http.delete(environment.backServer + this.libraryLink + '/' + id).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
    
    edit(id: string, library: Library) {
      return new Promise((resolve, reject) => {
        this.http.put(environment.backServer + this.libraryLink +'/' + id, library).subscribe(
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
      return new Promise<Library>((resolve, reject) => {
        (this.http.get(
          environment.backServer + this.libraryLink + '/' + id) as Observable<Library>)
          .subscribe(
            (res: Library) => {
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