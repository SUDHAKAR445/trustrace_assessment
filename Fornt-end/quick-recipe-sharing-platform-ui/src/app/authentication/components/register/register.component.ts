import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { Token } from 'src/app/model/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { VerifyEmailDialogComponent } from 'src/app/utility/verify-email-dialog/verify-email-dialog.component';
import { CustomValidators } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements IDeactivateComponent{

  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);
  router: Router =inject(Router);
  customValidator: CustomValidators = inject(CustomValidators);

  hide: boolean = true;
  isSubmitted: boolean = false;
  registerForm!: FormGroup;
  formStatus!: FormControlStatus;
  isLoading: boolean = false;
  user!: Subscription;
  role: string | undefined = undefined;

  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, [Validators.required, this.customValidator.checkUsername]),
      firstName: new FormControl(null, [Validators.required, this.customValidator.noSpaceAllowed]),
      lastName: new FormControl(null, [Validators.required, this.customValidator.noSpaceAllowed]),
      gender: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email, this.customValidator.checkEmail]),
      password: new FormControl(null, [Validators.required, Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)])
    });

    this.registerForm.statusChanges.subscribe((value) => {
      this.formStatus = value;
    })

    this.user = this.authService.user.subscribe((data: Token | null) => {
      this.role = data?.authority;
    })

    if (this.role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']);
    } else if (this.role === "ROLE_MODERATOR") {
      this.router.navigate(['/moderator']);
    } else if (this.role === "ROLE_USER"){
      this.router.navigate(['/user']);
    }
  }

  onRegisterClicked() {
    this.isSubmitted = true;
    this.isLoading = true;
    this.authService.register(this.registerForm.get('userName')?.value,
      this.registerForm.get('firstName')?.value,
      this.registerForm.get('lastName')?.value,
      this.registerForm.get('email')?.value,
      this.registerForm.get('gender')?.value,
      this.registerForm.get('password')?.value).subscribe({
        next: () => {
          this.alertService.showSuccess('Registered successfully. Please verify the email');
          this.router.navigate(['/login']);
        },
          error: (error) => {
            this.isLoading = false;
            this.alertService.showError('Email id or Username already exists');
          }
        })
    }
  
    onDestroy() {
      this.user.unsubscribe();
    }

    canExit(): boolean | Promise<boolean> | Observable<boolean> {
      if (this.registerForm.dirty && !this.isSubmitted) {
        return this.alertService.confirmExit();
      } else {
        return true;
      }
    }
  }