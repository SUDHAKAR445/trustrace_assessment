import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogComponent } from 'src/app/utility/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements IDeactivateComponent{

  authService: AuthService = inject(AuthService);
  activateRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);

  isLoading: boolean = false;
  isSubmitted: boolean = false;
  formStatus!: FormControlStatus | undefined;
  resetForm!: FormGroup;
  emailId!: string | null;

  ngOnInit() {

    this.activateRoute.queryParamMap.subscribe((data) => {
      this.emailId = data.get('email');
    });

    this.resetForm = new FormGroup({
      email: new FormControl(this.emailId),
      password: new FormControl(null, [Validators.required, Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)]),
      confirm: new FormControl(null)
    })
  }

  onResetClicked() {
    this.isSubmitted = true;
    this.authService.changePassword(this.resetForm.get('email')?.value, this.resetForm.get('password')?.value).subscribe({
      next: () => {
        this.alertService.showSuccess('Your password has been reset successfully');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.alertService.showError('Failed to reset your password. Please try again later');
        this.router.navigate(['/login']);
      }
    });
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.resetForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
