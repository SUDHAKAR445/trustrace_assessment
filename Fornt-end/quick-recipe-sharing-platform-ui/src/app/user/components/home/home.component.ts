import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  userProfile!: User | null;
  followersList!: User[] | null;
  followingList!: User[] | null;
  errorMessage!: string | null;
  showEditButton: boolean = false;
  subscription!: Subscription;
  subscriptionFollowers!: Subscription;
  subscriptionFollowing!: Subscription;

  ngOnInit() {
    this.authService.userDetail.subscribe((data) => {
      this.userProfile = data;
    });

    this.authService.followers.subscribe((data) => {
      this.followersList = data;
    });

    this.authService.following.subscribe((data) => {
      this.followingList = data;
    })
  }
  
  onCreateRecipeClicked() {
    this.router.navigate(['/user/create']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionFollowers.unsubscribe();
    this.subscriptionFollowing.unsubscribe();
  }
}
