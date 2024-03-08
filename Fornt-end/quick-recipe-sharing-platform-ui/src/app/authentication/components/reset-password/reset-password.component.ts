import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogComponent } from 'src/app/utility/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  constructor(private dialog: MatDialog) { }

  isLoading: boolean = false;
  errorMessage: string | null = null
  formStatus!: FormControlStatus | undefined;
  resetForm!: FormGroup;
  authService: AuthService = inject(AuthService);
  activateRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
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
    console.log(this.resetForm.get('password')?.value);
    this.authService.changePassword(this.resetForm.get('email')?.value, this.resetForm.get('password')?.value).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { message: 'Your password has been reset' },
        });
    
        dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate(['/login']);
        });
      }
    })
  }
}
