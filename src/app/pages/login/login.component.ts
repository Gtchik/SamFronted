import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @Output() authWork= new EventEmitter<string>();

  validateForm!: FormGroup;
  errorMessage!: string;

  constructor( private fb: FormBuilder,
               private auth: AuthService,
               private router: Router,
               private message: NzMessageService,
               private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],

    })
  }

  submitForm(){
    const idMessage = this.message.loading(
      'Connection en cours', { nzDuration: 0}
    ).messageId;
    const firstName = this.validateForm.get('firstName')?.value;
    const lastName = this.validateForm.get('lastName')?.value;
    this.auth.login(firstName, lastName).then(
      () => {
        this.authWork.emit('Auth succed');
        this.message.remove(idMessage);
        this.message.success("Connexion établie")
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/');
      }
    ).catch(
      (error) => {
        this.message.remove(idMessage);
        this.message.error(error.message)
      }
    );
    
  }

}
