import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Library } from 'src/app/core/models/Library.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LibraryService } from 'src/app/core/services/library.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  librarys !: Library[];
  modalRef!: NzModalRef;
  admin!: boolean;
  idSelected!: any;
  idMessage = this.message.loading(
    'Connexion en cours', { nzDuration: 0}
  ).messageId;

  constructor(private libraryService: LibraryService,
              private authService: AuthService,
              private modalService: NzModalService,
              private message: NzMessageService) { }

  ngOnInit(): void {
    this.admin = this.authService.admin;
    this.libraryService.findAll().then(
      (librarys) => {
        this.librarys = librarys;
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
    this.libraryService.findAll().then(
      (librarys) => this.librarys = librarys
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
    console.log('401')
    return true
  }

  delete(){
    this.libraryService.delete(this.idSelected);
    this.modalRef.destroy()
    this.librarys = this.librarys.filter(
      (value, key, arr) => {
        return value._id != this.idSelected
      }
    )
  }

}
