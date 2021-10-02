import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth-guard.service';
import { HomeComponent } from './pages/home/home.component';
import { HubComponent } from './pages/hub/hub.component';
import { LibraryComponent } from './pages/library/library.component';
import { MissionComponent } from './pages/mission/mission.component';
import { StepComponent } from './pages/mission/step/step.component';

const routes: Routes = [
  {
    path : "login",
    component : HomeComponent
  },
  {
    path: "",
    component : HubComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "library",
    component : LibraryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "missions",
    component : MissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "steps/:mission",
    component : StepComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
