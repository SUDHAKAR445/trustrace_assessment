import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth-interceptor.interceptor';
import { ConfirmDialogComponent } from './utility/confirm-dialog/confirm-dialog.component';
import { ReportDialogComponent } from './utility/report-dialog/report-dialog.component';
import { CustomValidators } from './validators/custom.validator';
import { VerifyEmailDialogComponent } from './utility/verify-email-dialog/verify-email-dialog.component';
import { SuccessPopComponent } from './utility/success-pop/success-pop.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    ReportDialogComponent,
    VerifyEmailDialogComponent,
    SuccessPopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    CustomValidators
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
