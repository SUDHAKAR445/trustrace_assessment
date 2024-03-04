import { Component, inject } from '@angular/core';
import { FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Token } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  hide: boolean = true;
  registerForm!: FormGroup;
  formStatus!: FormControlStatus;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  user!: Subscription;
  role: string | undefined = undefined;


  authService: AuthService = inject(AuthService);

  router: Router =inject(Router);
  ngOnInit() {
    this.registerForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
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
    this.isLoading = true;
    this.authService.register(this.registerForm.get('userName')?.value,
      this.registerForm.get('firstName')?.value,
      this.registerForm.get('lastName')?.value,
      this.registerForm.get('email')?.value,
      this.registerForm.get('password')?.value).subscribe({
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