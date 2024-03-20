import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-follower-list',
  templateUrl: './follower-list.component.html',
  styleUrls: ['./follower-list.component.scss']
})
export class FollowerListComponent implements OnInit, OnDestroy {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  followService: FollowService = inject(FollowService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);

  userId!: string | null;
  user!: string | null;
  followers!: User[];
  isLoading: boolean = false;
  followerList!: User[] | null;
  followingList!: User[] | null;
  likedRecipes!: string[] | null;
  userIdSubscription!: Subscription;
  followerListSubscription!: Subscription;
  followingListSubscription!: Subscription;


  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.user = data.get('id');
      this.followService.getAllFollowersById(this.user).subscribe({
        next: (response: User[]) => {
          this.followers = response;
          
        },
        error: (error) => {
          this.alertService.showError("Error in fetching the followers");
        }
      });
    });

    this.userIdSubscription = this.authService.user.subscribe((data) => {
      this.userId = data?.id || '';
    });

    this.followerListSubscription = this.authService.followers.subscribe((data) => {
      this.followerList = data;
    });

    this.followingListSubscription = this.authService.following.subscribe((data) => {
      this.followingList = data;
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
      },
      error: (error) => {
        this.alertService.showError('Error in unfollow the user');
      }
    });
  }

  showUserDetail(id: string | undefined) {
    this.router.navigate(['/user/bio'], { queryParams: {'id': id}});
  }

  ngOnDestroy(){
    this.userIdSubscription.unsubscribe();
    this.followerListSubscription.unsubscribe();
    this.followingListSubscription.unsubscribe();
  }
}
