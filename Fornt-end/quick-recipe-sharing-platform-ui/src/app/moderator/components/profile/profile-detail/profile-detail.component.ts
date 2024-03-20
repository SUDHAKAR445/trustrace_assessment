import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit, OnDestroy {

  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);

  userId!: string | null | undefined;
  userDetail!: User;
  userIdSubscription!: Subscription;
  
  ngOnInit(){
    this.userIdSubscription = this.authService.user.subscribe((data) => {
      this.userId = data?.userId;
    })

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.userDetail = response;
      },
      error: (error) => {
        this.alertService.showError("Error in loading your profile");
      }
    })
  }

  updateProfile() {
    this.router.navigate(['/moderator/profile/update']);
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
  }
}
