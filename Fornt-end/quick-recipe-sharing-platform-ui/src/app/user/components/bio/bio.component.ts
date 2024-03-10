import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowService } from 'src/app/services/follow.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit{

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  recipeService: RecipeService = inject(RecipeService);
  followService: FollowService = inject(FollowService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  userFollowers: BehaviorSubject<User[] | null> = new BehaviorSubject<User[] | null>(null);
  userFollowing: BehaviorSubject<User[] | null> = new BehaviorSubject<User[] | null>(null);

  userId!: string;
  bioId!: string | null;
  errorMessage!: string | null;
  followerList!: User[] | null;
  followingList!: User[] | null;
  userFollowersList!: User[] | null;
  userFollowingList!: User[] | null;
  totalPosts!: number;
  userDetail!: User;
  subscription!: Subscription;
  subscription1!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;
  subscription4!: Subscription;

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.bioId = data.get('id');

      this.followService.getAllFollowersById(this.bioId).subscribe((data) => {
        this.userFollowers.next(data);
      });

      this.followService.getAllFollowingById(this.bioId).subscribe((data) => {
        this.userFollowing.next(data);
      });

      this.userService.getUserById(this.bioId).subscribe((data) => {
        this.userDetail = data;
      });
    });
    this.subscription = this.authService.user.subscribe((data) => {
      this.userId = data?.id || '';
    });

    this.subscription1 = this.authService.followers.subscribe((data) => {
      this.followerList = data;
    });

    this.subscription2 = this.authService.following.subscribe((data) => {
      this.followingList = data;
    });

    this.subscription3 = this.userFollowers.subscribe((data) => {
      this.userFollowersList = data;
    });

    this.subscription4 = this.userFollowing.subscribe((data) => {
      this.userFollowingList = data;
    });

    this.recipeService.getCountOfRecipes(this.bioId).subscribe((data) => {
      this.totalPosts = data[0];
    });
  }

  checkFollow(id: string): boolean {
    return this.followingList?.some(user => user.id === id) ?? false;
  }

  onFollowNowClick(followerUserId: string) {
    this.followService.followRequest(followerUserId, this.userId).subscribe({
      next: () => {
        this.followService.getAllFollowersById(this.userId).subscribe((data) => {
          this.authService.followers.next(data);
        });

        this.followService.getAllFollowingById(this.userId).subscribe((data) => {
          this.authService.following.next(data);
        });

        this.followService.getAllFollowersById(this.bioId).subscribe((data) => {
          this.userFollowers.next(data);
        });

        this.followService.getAllFollowingById(this.bioId).subscribe((data) => {
          this.userFollowing.next(data);
        });
      },
      error: (error) => {
        this.alertService.showError('Error in following the user');
      }
    });
  }

  onUnfollowNowClick(followerUserId: string) {
    this.followService.unfollowRequest(followerUserId, this.userId).subscribe({
      next: () => {
        this.followService.getAllFollowersById(this.userId).subscribe((data) => {
          this.authService.followers.next(data);
        });

        this.followService.getAllFollowingById(this.userId).subscribe((data) => {
          this.authService.following.next(data);
        });

        this.followService.getAllFollowersById(this.bioId).subscribe((data) => {
          this.userFollowers.next(data);
        });

        this.followService.getAllFollowingById(this.bioId).subscribe((data) => {
          this.userFollowing.next(data);
        });
      },
      error: (error) => {
        this.alertService.showError('Error in unfollow the user');
      }
    });
  }

  showFollowers(id: string | null) {
    this.router.navigate(['/user/followers'], { queryParams: { 'id': id } });
  }

  showFollowing(id: string | null) {
    this.router.navigate(['/user/following'], { queryParams: { 'id': id } });
  }

  showPosts(id: string | null) {
    this.router.navigate(['/user/post'], { queryParams: { 'id': id } });
  }
}
