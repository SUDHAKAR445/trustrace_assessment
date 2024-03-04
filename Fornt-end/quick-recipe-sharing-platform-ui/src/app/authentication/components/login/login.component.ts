import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Token } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null
  formStatus!: FormControlStatus | undefined;
  loginForm!: FormGroup;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  role: string | undefined = undefined;
  isLoggedIn: boolean = true;

  user!: Subscription;

  ngOnInit() {
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    })

    this.loginForm.statusChanges.subscribe((value) => {
      // console.log(value);
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

  onLoginClicked() {
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
            this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error;
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      })
  }

  onDestroy() {
    this.user.unsubscribe();
  }
}
