import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { hasOtpVerified } from '../routeGuards/authGuard.guard';
import { VerifyComponent } from './components/verify/verify.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent, canDeactivate: [(comp: LoginComponent) => {return comp.canExit()}]
  },
  {
    path: 'register', component: RegisterComponent, canDeactivate: [(comp: RegisterComponent) => {return comp.canExit()}]
  },
  {
    path: 'forgot-password', component: ForgetPasswordComponent, canDeactivate: [(comp: ForgetPasswordComponent) => {return comp.canExit()}]
  },
  {
    path: 'change-password', component: ResetPasswordComponent, canActivate: [hasOtpVerified], canDeactivate: [(comp: ResetPasswordComponent) => {return comp.canExit()}]
  },
  {
    path: 'confirm-account', component: VerifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
