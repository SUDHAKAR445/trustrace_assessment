import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { Token } from 'src/app/model/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements IDeactivateComponent{

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);

  hide: boolean = true;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  formStatus!: FormControlStatus | undefined;
  loginForm!: FormGroup;
  role: string | undefined = undefined;
  isLoggedIn: boolean = true;

  user!: Subscription;

  ngOnInit() {
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })

    this.loginForm.statusChanges.subscribe((value) => {
      this.formStatus = value;
    })

    this.user = this.authService.user.subscribe((data: Token | null) => {
      this.role = data?.authority;
    })

    if (this.role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']);
    } else if (this.role === "ROLE_MODERATOR") {
      this.router.navigate(['/moderator']);
    } else if (this.role === "ROLE_USER") {
      this.router.navigate(['/user']);
    }
  }

  onLoginClicked() {
    this.isSubmitted = true;
    this.isLoading = true;
    this.authService.login(this.loginForm.get('usernameOrEmail')?.value,
      this.loginForm.get('password')?.value).subscribe({
        next: () => {
          this.user = this.authService.user.subscribe((data: Token | null) => {
            this.role = data?.authority;
          })

          if (this.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin']);
          } else if (this.role === "ROLE_MODERATOR") {
            this.router.navigate(['/moderator']);
          } else {
            this.router.navigate(['/user']);
          }
          this.alertService.showSuccess('Logged in Successfully');
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.alertService.showError('Username or Password invalid');
        }
      })
  }

  onDestroy() {
    this.user.unsubscribe();
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.loginForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
