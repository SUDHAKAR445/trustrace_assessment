import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoadComponent } from '../utility/load/load.component';
import { SnackbarComponent } from '../utility/snackbar/snackbar.component';
import {MatSelectModule} from '@angular/material/select';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifyComponent } from './components/verify/verify.component';
import { MatRadioModule } from '@angular/material/radio';
import { AuthenticationLoaderComponent } from '../utility/authentication-loader/authentication-loader.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    LoadComponent,
    SnackbarComponent,
    MatSelectModule,
    MatRadioModule,
    AuthenticationLoaderComponent
  ]
})
export class AuthenticationModule { }
