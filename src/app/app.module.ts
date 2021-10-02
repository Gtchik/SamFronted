import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { LoginComponent } from './pages/login/login.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HubComponent } from './pages/hub/hub.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { LibraryComponent } from './pages/library/library.component';
import { FormLibraryComponent } from './pages/library/form/form.component';
import { HttpTokenInterceptor } from './core/interceptors/auth-interceptor';
import { MissionComponent } from './pages/mission/mission.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormMissionComponent } from './pages/mission/form/form.component';
import { StepComponent } from './pages/mission/step/step.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormStepComponent } from './pages/mission/step/form-step/form-step.component';

registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HubComponent,
    LibraryComponent,
    FormLibraryComponent,
    FormMissionComponent,
    MissionComponent,
    StepComponent,
    FormStepComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSpinModule,
    NzMessageModule,
    NzTreeModule,
    NzCheckboxModule,
    NzDividerModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: fr_FR },
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpTokenInterceptor, 
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
