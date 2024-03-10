import { Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Comment } from 'src/app/model/comment.model';
import { Recipe } from 'src/app/model/recipe.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { FollowService } from 'src/app/services/follow.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/utility/confirm-dialog/confirm-dialog.component';
import { ReportDialogComponent } from 'src/app/utility/report-dialog/report-dialog.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  recipeService: RecipeService = inject(RecipeService);
  userService: UserService = inject(UserService);
  commentService: CommentService = inject(CommentService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  followService: FollowService = inject(FollowService);
  alertService: AlertService = inject(AlertService);
  dialog: MatDialog = inject(MatDialog);

  recipeId!: string | null;
  recipe!: Recipe;
  recipeComments: Comment[] = [];
  followerList!: User[] | null;
  followingList!: User[] | null;
  likedComments!: string[] | null;
  userId!: string | null | undefined;
  errorMessage!: string | null;
  isLoading: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 10;
  newCommentText!: string;
  userDetail!: User;
  subscription1!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;

  ngOnInit() {
    this.subscription1 = this.authService.followers.subscribe((data) => {
      this.followerList = data;
    });

    this.subscription2 = this.authService.following.subscribe((data) => {
      this.followingList = data;
    });

    this.subscription3 = this.authService.likedComments.subscribe((data) => {
      this.likedComments = data;
    });

    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
      this.userService.getUserById(this.userId).subscribe({
        next: (response) => {
          this.userDetail = response;
        },
        error: (error) => {
          this.alertService.showError("Error occurred in showing user details");
        },
      });
    });

    this.activeRoute.queryParamMap.subscribe((data) => {
      this.recipeId = data.get('detail');
    });

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        this.recipe = response;
      },
      error: (error) => {
        this.alertService.showError("Error occurred in showing recipe details");
      },
    });

    this.loadComments();
  }

  loadComments(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.commentService.getAllComments(this.recipeId, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.recipeComments = [...this.recipeComments, ...response.content];
        this.pageIndex++;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.showError("Error occurred in showing comments");
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.loadComments();
    }
  }

  onLikeClick(id: string): void {
    this.commentService.likeComment(id, this.userId).subscribe({
      next: () => {
        this.commentService.getAllLikedCommentsByUser(this.userId).subscribe((data) => {
          this.authService.likedComments.next(data);
        });
      },
      error: () => {
        this.alertService.showError('Error occurred in like the comment');
      }
    })
  }

  onUnlikeClick(id: string): void {
    this.commentService.unlikeComment(id, this.userId).subscribe({
      next: () => {
        this.commentService.getAllLikedCommentsByUser(this.userId).subscribe((data) => {
          this.authService.likedComments.next(data);
        });
      },
      error: () => {
        this.alertService.showError('Error occurred in unlike the comment');
      }
    })
  }

  onUpdateClick(id: string) {
    this.alertService.confirm('Confirm', 'Are you sure do you want to update this recipe').then((isConfirmed) => {
      if (isConfirmed) {
        this.router.navigate(['/user/update'], { queryParams: { "detail": id } });
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

  onReportComment(id: string | undefined) {
    const dialogRef = this.dialog.open(ReportDialogComponent);
    dialogRef.afterClosed().subscribe((reportReason) => {
      if (reportReason) {
        this.alertService.confirmDelete('Confirm', 'Are you do you want report this comment').then((isConfirmed) => {
          if (isConfirmed) {
            this.commentService.reportComment(this.userId, id, reportReason).subscribe({
              next: () => {
                this.alertService.showSuccess('Comment reported successfully');
              },
              error: (error) => {
                this.isLoading = false;
                this.alertService.showError('Error occurred in reporting the comment')
              },
            });
          }
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

  postComment() {
    this.recipeService.createComment(this.recipeId, this.userId, this.newCommentText).subscribe({
      next: (newComment) => {
        this.recipeComments = [newComment, ...this.recipeComments];
        this.newCommentText = '';
        this.alertService.showSuccess('Comment posted successfully');
        // window.location.reload();
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.showError('Error occurred in posting the comment');
      }
    })
  }


  onDeleteComment(id: string | undefined) {
    this.alertService.confirmDelete('Confirm', 'Are you do you want delete this comment').then((isConfirmed) => {
      if (isConfirmed) {
        this.commentService.deleteCommentById(id).subscribe({
          next: () => {
            this.recipeComments = this.recipeComments.filter((comment) => comment.id !== id);
            this.alertService.showSuccess('Comment deleted successfully');
          },
          error: (error) => {
            this.isLoading = false;
            this.alertService.showError('Error occurred in deleting the comment');
          },
        });
      }
    });
  }

  showUserDetail(id: string | undefined) {
    this.router.navigate(['/user/bio'], { queryParams: { 'id': id } });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }
}
