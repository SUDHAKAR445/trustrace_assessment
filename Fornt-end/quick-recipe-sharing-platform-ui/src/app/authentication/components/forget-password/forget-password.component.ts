import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {

  countdown: number = 300;
  hideButton: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null
  formStatus!: FormControlStatus | undefined;
  forgotPasswordForm!: FormGroup;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      otp: new FormControl({ value: null, disabled: true }, [Validators.maxLength(6), Validators.minLength(6), Validators.required])
    });
  }
  
  intervalId: any;

  onSentOptButtonClicked() {
    this.forgotPasswordForm.get('email')?.disable();
    this.authService.verifyEmail(this.forgotPasswordForm.get('email')?.value).subscribe({
      next: () => {
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
        if (error.status === 404) {
          this.errorMessage = "Email not found";
        } else {
          this.errorMessage = error;
        }
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onForgotPasswordSubmit() {
    this.authService.verifyOtp(this.forgotPasswordForm.get('otp')?.value, this.forgotPasswordForm.get('email')?.value).subscribe({
      next: () => {
        this.authService.setOtpVerificationStatus(true);
        this.router.navigate(['/change-password'], { queryParams: { 'email': this.forgotPasswordForm.get('email')?.value}});
      },
      error: (error) => {
        this.forgotPasswordForm.get('otp')?.enable();
        if (error.status === 404) {
          this.errorMessage = "Email not found";
        } else if (error.status === 406) {
          this.errorMessage = "Invalid Otp";
        } else if (error.status === 417) {
          this.errorMessage = "OTP has been expired (Click send OTP again)";
        }
        else {
          this.errorMessage = "Some error has occurred please try again or wait until the clock ran out";
        }
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }
}
