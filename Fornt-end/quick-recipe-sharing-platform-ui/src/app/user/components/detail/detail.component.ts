import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { FollowService } from 'src/app/services/follow.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ReportDialogComponent } from 'src/app/utility/report-dialog/report-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  dialog: MatDialog = inject(MatDialog);
  recipeService: RecipeService = inject(RecipeService);
  authService: AuthService = inject(AuthService);
  commentService: CommentService = inject(CommentService);
  router: Router = inject(Router);
  followService: FollowService = inject(FollowService);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  alertService: AlertService = inject(AlertService);

  recipes: any[] = [];
  page = 0;
  pageSize = 10;
  isLoading = false;
  errorMessage!: string | null;
  userId!: string;
  bioId!: string | null;
  followerList!: User[] | null;
  followingList!: User[] | null;
  likedRecipes!: string[] | null;
  userIdSubscription!: Subscription;
  followerListSubscription!: Subscription;
  followingListSubscription!: Subscription;
  LikedListSubscription!: Subscription;

  ngOnInit(): void {

    this.activeRoute.queryParamMap.subscribe((data) => {
      this.bioId = data.get('id');
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

    this.LikedListSubscription = this.authService.likedRecipes.subscribe((data) => {
      this.likedRecipes = data;
    });

    this.loadRecipes();
  }

  loadRecipes(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.recipeService.getAllRecipeByUserId(this.bioId, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.recipes = [...this.recipes, ...response.content];
        this.page++;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.showError('Error in loading the user recipes');
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      this.loadRecipes();
    }
  }

  onShowDetailClicked(id: string) {
    this.router.navigate(['/user/detail'], { queryParams: { "detail": id } });
  }

  onLikeClick(id: string): void {
    this.recipeService.likeRecipe(id, this.userId).subscribe({
      next: () => {
        this.recipeService.getAllLikedRecipes(this.userId).subscribe((data) => {
          this.authService.likedRecipes.next(data);
        });
      },
      error: () => {
        this.alertService.showError('Error in like the recipe');
      }
    })
  }

  onUnlikeClick(id: string): void {
    this.recipeService.unlikeRecipe(id, this.userId).subscribe({
      next: () => {
        this.recipeService.getAllLikedRecipes(this.userId).subscribe((data) => {
          this.authService.likedRecipes.next(data);
        });
      },
      error: () => {
        this.alertService.showError('Error in unlike the recipe');
      }
    })
  }

  onCommentClick(id: string) {
    this.router.navigate(['/user/detail'], { fragment: 'bookmark', queryParams: { "detail": id } });
  }

  onUpdateClick(id: string) {
    this.alertService.confirm('Confirm', 'Are you sure do you want to update this recipe').then((isConfirmed) => {
      if (isConfirmed) {
        this.router.navigate(['/user/update'], { queryParams: { "detail": id } });
      }
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
        this.alertService.showError('Error occurred in following the user');
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
        this.alertService.showError('Error occurred in unfollow the user');
      }
    });
  }


  onDeleteRecipe(id: string | undefined) {
    this.alertService.confirmDelete('Confirm', 'Are you do you want delete this recipe').then((isConfirmed) => {
      if (isConfirmed) {
        this.recipeService.deleteRecipeById(id).subscribe({
          next: () => {
            this.alertService.showSuccess('Recipe deleted successfully');
            this.router.navigate(['/user/feed']);
          },
          error: (error) => {
            this.isLoading = false;
            this.alertService.showError('Error occurred in deleting the recipe');
          }
        })
      }
    });
  }

  onBookNowClick(id: string | undefined) {
    this.alertService.confirm('Confirm', 'Are you sure do you want to book this recipe').then((isConfirmed) => {
      if (isConfirmed) {
        this.router.navigate(['/user/book'], { queryParams: { 'detail': id, 'id': this.userId } });
      }
    });
  }

  onSaveRecipe(id: string | undefined) {
    this.alertService.confirm('Confirm', 'Are you do you want save this recipe').then((isConfirmed) => {
      if (isConfirmed) {
        this.recipeService.saveRecipeInUserCollection(this.userId, id).subscribe({
          next: () => {
            this.alertService.confirmDelete('Confirm', 'Are you do you want see this saved recipe').then((isConfirmed) => {
              if (isConfirmed) {
                this.router.navigate(['/user/saved']);
              }
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.alertService.showError('Error occurred in saving the recipe');
          },
        });
      }
    });
  }

  onReportRecipe(id: string | undefined) {
    const dialogRef = this.dialog.open(ReportDialogComponent);
    dialogRef.afterClosed().subscribe((reportReason) => {
      if (reportReason) {
        this.alertService.confirmDelete('Confirm', 'Are you do you want report this recipe').then((isConfirmed) => {
          if (isConfirmed) {
            this.commentService.reportRecipe(this.userId, id, reportReason).subscribe({
              next: () => {
                this.alertService.showSuccess('Recipe reported successfully');
              },
              error: (error) => {
                this.isLoading = false;
                this.alertService.showError('Error occurred in reporting the recipe')
              },
            });
          }
        });
      }
    });
  }

  onReportUser(id: string | undefined) {
    const dialogRef = this.dialog.open(ReportDialogComponent);
    dialogRef.afterClosed().subscribe((reportReason) => {
      if (reportReason) {
        this.alertService.confirmDelete('Confirm', 'Are you do you want report this user').then((isConfirmed) => {
          if (isConfirmed) {
            this.commentService.reportUser(this.userId, id, reportReason).subscribe({
              next: () => {
                this.alertService.showSuccess('User reported successfully');
              },
              error: (error) => {
                this.isLoading = false;
                this.alertService.showError('Error occurred in reporting the user')
              },
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
    this.followerListSubscription.unsubscribe();
    this.followingListSubscription.unsubscribe();
    this.LikedListSubscription.unsubscribe();
  }
}
