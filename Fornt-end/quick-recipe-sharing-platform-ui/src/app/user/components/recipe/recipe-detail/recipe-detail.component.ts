import { Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from 'src/app/model/comment.model';
import { Recipe } from 'src/app/model/recipe.model';
import { User } from 'src/app/model/user-detail';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
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

  recipeId!: string | null;
  recipe!: Recipe;
  recipeComments: Comment[] = [];
  userId!: string | null | undefined;
  errorMessage!: string | null;
  isLoading: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 10;
  newCommentText!: string;
  userDetail!: User;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {

    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
      this.userService.getUserById(this.userId).subscribe({
        next: (response) => {
          this.userDetail = response;
        },
        error: (error) => {
          console.error("Error creating recipe:", error);
          this.errorMessage = error;
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    });

    this.activeRoute.queryParamMap.subscribe((data) => {
      this.recipeId = data.get('detail');
    });

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        this.recipe = response;
        console.log(this.recipe);
      },
      error: (error) => {
        console.error("Error creating recipe:", error);
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.loadComments();
    }
  }

  onLikeClick() { }

  onUpdateClick(id: string | undefined) {
    this.router.navigate(['/user/update'], { queryParams: { "detail": id } });
  }
  onDeleteRecipe(id: string | undefined) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this recipe?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.recipeService.deleteRecipeById(id).subscribe({
          next: () => {
            this.router.navigate(['/user/feed']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error;
            setTimeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        })
      }
    });
  }

  onBookNowClick(id: string | undefined) {
    this.router.navigate(['/user/book'], { queryParams: { 'detail': id, 'id': this.userId } });
  }

  onLikeComment(id: string | undefined) {

  }

  onSaveRecipe(id: string | undefined) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to save this recipe?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.recipeService.saveRecipeInUserCollection(this.userId, id).subscribe({
          next: () => {
            const saveDialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: { message: 'Are you wanted to see the saved recipe collection?' },
            });
            saveDialogRef.afterClosed().subscribe((result) => {
              if (result) {
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

  onReportComment(id: string | undefined) {
    const dialogRef = this.dialog.open(ReportDialogComponent);

    dialogRef.afterClosed().subscribe((reportReason) => {
      if (reportReason) {
        const reportDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { message: 'Are you sure you want to report this comment?' },
        });
        reportDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            console.log(result);
            this.commentService.reportComment(this.userId, id, reportReason).subscribe({
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
          data: { message: 'Are you sure you want to report this comment?' },
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

  postComment() {
    this.recipeService.createComment(this.recipeId, this.userId, this.newCommentText).subscribe({
      next: (newComment) => {
        this.recipeComments = [newComment, ...this.recipeComments];
        this.newCommentText = '';
        window.location.reload();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }


  onDeleteComment(id: string | undefined) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this comment?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentService.deleteCommentById(id).subscribe({
          next: () => {
            this.recipeComments = this.recipeComments.filter((comment) => comment.id !== id);
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
}
