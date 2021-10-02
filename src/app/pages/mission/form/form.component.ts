import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MissionService } from 'src/app/core/services/mission.service';
import { EventEmitter } from '@angular/core';
import { Mission } from 'src/app/core/models/Mission.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-form-mission',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormMissionComponent implements OnInit {

  @Output() formWork= new EventEmitter<string>();
  @Input() id:string = "";
  validateForm: FormGroup =  this.fb.group({
    title: [null, [Validators.required]],
    order: [null],
    icon: [null, [Validators.required]]
  });



  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private missionService: MissionService,
              private auth: AuthService) { }

  ngOnInit(): void {
    if (this.id!=""){
      this.missionService.findOneById(this.id)
      .then(
        res => {
          console.log(res)
          this.validateForm.setValue({
            title: res.title,
            order: res.order,
            icon: res.icon
          })
        }
      ).catch(error => console.error(error));
      }
    
  }

  submitForm(){
    const idMessage = this.message.loading(
      'Création en cours', { nzDuration: 0}
    ).messageId;
    const title = this.validateForm.get('title')?.value;
    const order = this.validateForm.get('order')?.value;
    const icon = this.validateForm.get('icon')?.value;
    if(this.id==""){
      this.missionService.createNew({_id:"", title: title, user: this.auth.userId, order:order, icon:icon}).then(
        () => {
          this.formWork.emit('form succed');
          this.message.remove(idMessage);
          this.message.success("Connexion établie")
        }
      ).catch(
        (error) => {
          this.message.remove(idMessage);
          this.message.error(error.message)
        });
      }else{
        this.missionService.edit(this.id,{_id:this.id, title: title, user:'', order:order, icon:icon}).then(
          () => {
            this.formWork.emit('form succed');
            this.message.remove(idMessage);
            this.message.success("Connexion établie")
          }
        ).catch(
          (error) => {
            this.message.remove(idMessage);
            this.message.error(error.message)
          });
      }
    
  }

}
