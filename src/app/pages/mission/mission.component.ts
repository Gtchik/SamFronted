import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Mission } from 'src/app/core/models/Mission.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { MissionService } from 'src/app/core/services/mission.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {

  missions !: any[];
  modalRef!: NzModalRef;
  admin!: boolean;
  idSelected!: any;
  idMessage = this.message.loading(
    'Connexion en cours', { nzDuration: 0}
  ).messageId;

  constructor(private missionService: MissionService,
              private authService: AuthService,
              private modalService: NzModalService,
              private message: NzMessageService,
              private router: Router) { }

  ngOnInit(): void {
    this.admin = this.authService.admin;
    this.missionService.findAll().then(
      (missions) => {
        
        this.missions = missions;
        this.message.remove(this.idMessage);
        this.message.success("Connexion établie")
      }
      ).catch(error => console.log(error))
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

  formValidate(){
    this.modalRef.destroy();
    this.missionService.findAll().then(
      (missions) => this.missions = missions
      ).catch(error => console.log(error));
  }

  onRightClick(event: any, nzRightTpl: TemplateRef<{ }>, id: any){
    if(this.admin){
    console.log(event);
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
    return true
  }

  delete(){
    this.missionService.delete(this.idSelected);
    this.modalRef.destroy()
    this.missions = this.missions.filter(
      (value, key, arr) => {
        return value._id != this.idSelected
      }
    )
  }

  click(_id:string){
    this.router.navigate(['steps', _id])
  }

}
