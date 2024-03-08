import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user-detail';
import { AuthService } from 'src/app/services/auth.service';
import { FollowService } from 'src/app/services/follow.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  followService: FollowService = inject(FollowService);

  userId!: string | null | undefined;
  userProfile!: User;
  followersList!: User[];
  followingList!: User[];
  errorMessage!: string | null;
  showEditButton: boolean = false;

  ngOnInit() {
    this.authService.user.subscribe((data) => {
      this.userId = data?.id
    });

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.userProfile = response;
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = error;
        }, 3000);
        this.errorMessage = null;
      }
    });

    this.followService.getAllFollowersById(this.userId).subscribe({
      next: (response) => {
        this.followersList = response;
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = error;
        }, 3000);
        this.errorMessage = null;
      }
    });

    this.followService.getAllFollowingById(this.userId).subscribe({
      next: (response) => {
        this.followingList = response;
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = error;
        }, 3000);
        this.errorMessage = null;
      }
    });
  }
  
  onCreateRecipeClicked() {
    this.router.navigate(['/user/create']);
  }
}
