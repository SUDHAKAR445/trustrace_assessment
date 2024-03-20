import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit{

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);

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
        this.isLoading = false;
        this.alertService.showSuccess('Account verified successfully');
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.showError('Link is broken or Already verified');
      }
    })
  }
}
