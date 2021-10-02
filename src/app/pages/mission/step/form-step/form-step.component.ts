import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StepService } from 'src/app/core/services/step.service';

@Component({
  selector: 'app-form-step',
  templateUrl: './form-step.component.html',
  styleUrls: ['./form-step.component.scss']
})
export class FormStepComponent implements OnInit {

  @Output() formWork= new EventEmitter<string>();
  @Input() id:string = "";
  @Input() missionId!:string;

  validateForm: FormGroup =  this.fb.group({
    title: [null, [Validators.required]],
    icon: [null],
    stepNumber: [null, [Validators.required]],
    method: [null, [Validators.required]],
    tools: [null, [Validators.required]]
  });



  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private stepService: StepService) { }

  ngOnInit(): void {
    console.log(this.id);
    if (this.id!=""){
      this.stepService.findOneById(this.id)
      .then(
        res => {
          console.log(res)
          this.validateForm.setValue({
            title: res.title,
            icon: res.icon,
            stepNumber: res.stepNumber,
            method: res.method,
            tools: res.tools
          })
        }
      ).catch(error => console.error(error));
      }
    
  }

  submitForm(){
    const idMessage = this.message.loading(
      'Création en cours', { nzDuration: 0}
    ).messageId;
    if(this.id==""){
      this.stepService.createNew({
        _id:"", 
        title: this.validateForm.get('title')?.value,
        icon: this.validateForm.get('icon')?.value,
        stepNumber: this.validateForm.get('stepNumber')?.value,
        method: this.validateForm.get('method')?.value,
        tools: this.validateForm.get('tools')?.value,
        mission: this.missionId
      }).then(
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
        this.stepService.edit(this.id,{
          _id:"", 
          title: this.validateForm.get('title')?.value,
          icon: this.validateForm.get('icon')?.value,
          stepNumber: this.validateForm.get('stepNumber')?.value,
          method: this.validateForm.get('method')?.value,
          tools: this.validateForm.get('tools')?.value,
          mission: this.missionId
        }).then(
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
