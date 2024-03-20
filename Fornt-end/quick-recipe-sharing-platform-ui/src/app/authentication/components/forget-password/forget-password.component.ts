import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements IDeactivateComponent{

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);

  countdown: number = 300;
  isSubmitted: boolean = false;
  hideButton: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null
  formStatus!: FormControlStatus | undefined;
  forgotPasswordForm!: FormGroup;

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      otp: new FormControl({ value: null, disabled: true }, [Validators.maxLength(6), Validators.minLength(6), Validators.required])
    });
  }
  
  intervalId!: number;

  onSentOptButtonClicked() {
    this.forgotPasswordForm.get('email')?.disable();
    this.authService.verifyEmail(this.forgotPasswordForm.get('email')?.value).subscribe({
      next: () => {
        this.alertService.showSuccess('Opt sent Successfully');
        this.forgotPasswordForm.get('otp')?.enable();
        this.hideButton = true;
        this.intervalId = setInterval(() => {
          this.countdown--;

          if (this.countdown <= 0) {
            clearInterval(this.intervalId);
            this.hideButton = false;
            this.forgotPasswordForm.get('email')?.enable();
            this.forgotPasswordForm.get('otp')?.disable();
          }
        }, 1000);
      },
      error: (error) => {
        this.forgotPasswordForm.get('email')?.enable();
        this.alertService.showError('Email does not exists');
      }
    });
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onForgotPasswordSubmit() {
    this.isSubmitted = true;
    this.authService.verifyOtp(this.forgotPasswordForm.get('otp')?.value, this.forgotPasswordForm.get('email')?.value).subscribe({
      next: () => {
        this.alertService.showSuccess('Otp verified successfully');
        this.authService.setOtpVerificationStatus(true);
        this.router.navigate(['/change-password'], { queryParams: { 'email': this.forgotPasswordForm.get('email')?.value}});
      },
      error: (error) => {
        this.forgotPasswordForm.get('otp')?.enable();
        this.alertService.showError('Otp mismatch or Some error has occurred please try again or wait until the clock ran out');
      }
    })
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.forgotPasswordForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
