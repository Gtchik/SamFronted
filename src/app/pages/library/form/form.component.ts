import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LibraryService } from 'src/app/core/services/library.service';
import { EventEmitter } from '@angular/core';
import { Library } from 'src/app/core/models/Library.model';

@Component({
  selector: 'app-form-library',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormLibraryComponent implements OnInit {

  @Output() formWork= new EventEmitter<string>();
  @Input() id:string = "";
  validateForm: FormGroup =  this.fb.group({
    title: [null, [Validators.required]],
    link: [null, [Validators.required]],
    order: [null],
    icon: [null, [Validators.required]]
  });



  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private libraryService: LibraryService) { }

  ngOnInit(): void {
    if (this.id!=""){
      this.libraryService.findOneById(this.id)
      .then(
        res => {
          console.log(res)
          this.validateForm.setValue({
            title: res.title,
            link: res.link,
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
    const link = this.validateForm.get('link')?.value;
    const order = this.validateForm.get('order')?.value;
    const icon = this.validateForm.get('icon')?.value;
    if(this.id==""){
      this.libraryService.createNew({_id:"", title: title, link: link, order:order, icon:icon}).then(
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
        this.libraryService.edit(this.id,{_id:this.id, title: title, link: link, order:order, icon:icon}).then(
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
