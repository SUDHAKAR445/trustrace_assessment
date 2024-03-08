import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from 'src/app/model/recipe.model';
import { User } from 'src/app/model/user-detail';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { FollowService } from 'src/app/services/follow.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/utility/confirm-dialog/confirm-dialog.component';
import { ReportDialogComponent } from 'src/app/utility/report-dialog/report-dialog.component';

@Component({
  selector: 'app-saved-recipe',
  templateUrl: './saved-recipe.component.html',
  styleUrls: ['./saved-recipe.component.scss']
})
export class SavedRecipeComponent {

  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  recipeService: RecipeService = inject(RecipeService);
  dialog: MatDialog = inject(MatDialog);
  router: Router = inject(Router);
  commentService: CommentService = inject(CommentService);
  followService: FollowService = inject(FollowService);

  errorMessage!: string | null;
  isFollow: boolean = false;
  isLoading: boolean = false;
  userId!: string;
  followerList!: User[] | null;
  followingList!: User[] | null;
  likedRecipes!: string[] | null;
  showNoBookingsMessage: boolean = false;
  hasLoadedInitialData: boolean = false;
  subscription!: Subscription;
  subscription1!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;

  recipes!: any[];

  ngOnInit() {
    this.subscription = this.authService.user.subscribe((data) => {
      this.userId = data?.id || '';
    });

    this.subscription1 = this.authService.followers.subscribe((data) => {
      this.followerList = data;
    });

    this.subscription2 = this.authService.following.subscribe((data) => {
      this.followingList = data;
    });

    this.subscription3 = this.authService.likedRecipes.subscribe((data) => {
      this.likedRecipes = data;
    });

    this.recipeService.getAllSavedRecipeByUserId(this.userId).subscribe({
      next: (response) => {
        this.recipes = response;
        if (!this.hasLoadedInitialData && response.length === 0) {
          const delayTime = 1000;

          setTimeout(() => {
            this.showNoBookingsMessage = true;
          }, delayTime);
        }

        this.hasLoadedInitialData = true;

      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });

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
      }
    })
  }

  onUnlikeClick(id: string): void {
    this.recipeService.unlikeRecipe(id, this.userId).subscribe({
      next: () => {
        this.recipeService.getAllLikedRecipes(this.userId).subscribe((data) => {
          this.authService.likedRecipes.next(data);
        });
      }
    })
  }

  onCommentClick(id: string) {
    this.router.navigate(['/user/detail'], { fragment: 'bookmark', queryParams: { "detail": id } });
  }

  onUpdateClick(id: string) {
    console.log(id);
    this.router.navigate(['/user/update'], { queryParams: { "detail": id } });
  }

  onBookNowClick(id: string) {
    this.router.navigate(['/user/book'], { queryParams: { 'detail': id, 'id': this.userId } });
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  onRemoveRecipe(id: string | undefined) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to remove this recipe?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.recipeService.removeRecipeInUserCollection(this.userId, id).subscribe({
          next: () => {
            const saveDialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: { message: 'Are you wanted to see the saved recipe collection?' },
            });
            saveDialogRef.afterClosed().subscribe((result) => {
              if (result) {
                window.location.reload();
                this.router.navigate(['/user/saved']);
              }
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error;
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          },
        });
      }
    });
  }

  onReportRecipe(id: string | undefined) {
    const dialogRef = this.dialog.open(ReportDialogComponent);

    dialogRef.afterClosed().subscribe((reportReason) => {
      if (reportReason) {
        const reportDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { message: 'Are you sure you want to report this comment?' },
        });
        reportDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log(result);
            this.commentService.reportRecipe(this.userId, id, reportReason).subscribe({
              next: () => {
              },
              error: (error) => {
                this.isLoading = false;
                this.errorMessage = error;
                setTimeout(() => {
                  this.errorMessage = null;
                }, 3000);
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
        const reportDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { message: 'Are you sure you want to report this user?' },
        });
        reportDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log(result);
            this.commentService.reportUser(this.userId, id, reportReason).subscribe({
              next: () => {
              },
              error: (error) => {
                this.isLoading = false;
                this.errorMessage = error;
                setTimeout(() => {
                  this.errorMessage = null;
                }, 3000);
              },
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
