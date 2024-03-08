import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  token!: string | null;
  showMessage: boolean = false;
  errorMessage!: string | null;
  isLoading: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.token = data.get('token');
    });

    this.authService.confirmAccount(this.token).subscribe({
      next: () => {
        this.showMessage = true;
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Link is broken or Already verified";
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }
}
