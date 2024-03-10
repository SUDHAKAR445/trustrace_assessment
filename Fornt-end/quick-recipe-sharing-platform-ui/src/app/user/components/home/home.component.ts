import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowService } from 'src/app/services/follow.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  followService: FollowService = inject(FollowService);
  alertService: AlertService = inject(AlertService);

  userId!: string | null | undefined;
  userProfile!: User | null;
  followersList!: User[] | null;
  followingList!: User[] | null;
  totalPost!: number | null;
  showEditButton: boolean = false;
  subscription!: Subscription;
  subscriptionFollowers!: Subscription;
  subscriptionFollowing!: Subscription;
  subscriptionPosts!: Subscription;

  ngOnInit() {
    this.subscription = this.authService.userDetail.subscribe((data) => {
      this.userProfile = data;
    });

    this.subscriptionFollowers = this.authService.followers.subscribe((data) => {
      this.followersList = data;
    });

    this.subscriptionFollowing = this.authService.following.subscribe((data) => {
      this.followingList = data;
    })
    this.subscriptionPosts = this.authService.recipesPosted.subscribe((data) => {
      this.totalPost = data;
    });
  }

  onCreateRecipeClicked() {
    this.router.navigate(['/user/create']);
  }

  showFollowing() {
    this.router.navigate(['/user/following'], { queryParams: { 'id': this.userProfile?.id } });
  }

  showFollowers() {
    this.router.navigate(['/user/followers'], { queryParams: { 'id': this.userProfile?.id } });
  }

  showPosts() {
    this.router.navigate(['/user/recipes']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionFollowers.unsubscribe();
    this.subscriptionFollowing.unsubscribe();
    this.subscriptionPosts.unsubscribe();
  }
}
