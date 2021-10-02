import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { StepService } from 'src/app/core/services/step.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
 
  steps!:any[];
  admin!:boolean;
  modalRef!: NzModalRef;
  idSelected!:string;
  idMessage = this.message.loading(
    'Connexion en cours', { nzDuration: 0}
  ).messageId;
  missionId: string = this.route.snapshot.paramMap.get("mission") || "";
  constructor( private stepService: StepService, 
               private route: ActivatedRoute,
               private message: NzMessageService,
               private authService: AuthService,
               private modalService: NzModalService) { }

  ngOnInit(): void {
    this.admin = this.authService.admin;
        this.stepService.findAllByMission(this.missionId).then(
          (steps: any[])=>{
            console.log(steps);
            
            this.steps = steps;
            this.message.remove(this.idMessage);
            this.message.success("Connexion établie");
          }
        ).catch((e)=>console.log(e));
    
    
  }

  check(key:string){
    this.steps.find((value, index)=>{
      if (value.key==key){
        value.isOver = false;
        this.stepService.CheckStep(key, this.missionId);
        this.steps[index]= value;
      }
    })    
  }
  expand(key:string){
    this.steps.find((value, index)=>{
      if (value.key==key){
        value.isExpanded = !value.isExpanded;
        this.steps[index]= value;
      }
    })
  }
  over(key:string, statut:boolean){
    this.steps.find((value, index)=>{
      if (value.key==key){
        value.isOver = statut;
        this.steps[index]= value;
      }
    })
  }

  formValidate(){
    this.modalRef.destroy();
    this.stepService.findAllByMission(this.missionId).then(
      (steps) => this.steps = steps
      ).catch(error => console.log(error));
  }

  onRightClick(event: any, nzRightTpl: TemplateRef<{ }>, id: any){
    if(this.admin){
    console.log(id);
    this.idSelected = id;
    this.modalRef = this.modalService.create({
      nzFooter : null,
      nzContent : nzRightTpl,
      nzWidth : 200,
      nzClosable : false,
      nzStyle:{ top:event.clientY+"px", left:event.clientX+"px", margin: 0 }
    });
    return false
    }
    console.log('401')
    return true
  }

  delete(){
    this.stepService.delete(this.idSelected);
    this.modalRef.destroy()
    this.steps = this.steps.filter(
      (value, key, arr) => {
        return value.key != this.idSelected
      }
    )
  }

  edit(nzTplEdit: TemplateRef<{ }>){
    this.modalRef.destroy();
    this.modalRef = this.modalService.create({
      nzTitle : "Modifier ",
      nzFooter : null,
      nzContent : nzTplEdit,
      nzWidth : 800,
      nzClosable : true
    });
  }

  createNew(nzTpl: TemplateRef<{ }>){
    this.modalRef = this.modalService.create({
      nzTitle : "Crée nouveau lien",
      nzFooter : null,
      nzContent : nzTpl,
      nzWidth : 800,
      nzClosable : true
    });
  }
}
