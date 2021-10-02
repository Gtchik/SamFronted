import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  modalRef!: NzModalRef;

  constructor(private modalService: NzModalService,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.auth.loginByStorage().then( ()=>{
      this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/');
    });
    
  }

  openModal(nzLoginTpl: TemplateRef<{}>){
    this.modalRef = this.modalService.create({
      nzTitle : "Se connecter",
      nzFooter : null,
      nzContent : nzLoginTpl,
      nzWidth : 800,
      nzClosable : true
    });

  }

  destroyModal(){
    this.modalRef.destroy()
  }
}
