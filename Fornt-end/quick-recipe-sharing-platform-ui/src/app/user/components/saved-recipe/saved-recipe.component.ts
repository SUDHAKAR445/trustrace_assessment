import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/model/recipe.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
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
  dialog: MatDialog = inject (MatDialog);
  router: Router = inject(Router);
  commentService: CommentService = inject(CommentService);

  errorMessage!: string | null;
  isLoading: boolean = false;
  userId!: string | null | undefined;
  showNoBookingsMessage: boolean = false;
  hasLoadedInitialData: boolean = false;

  recipes!: any[];

  ngOnInit() {
    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
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
    })
  }


  onShowDetailClicked(id: string) {
    this.router.navigate(['/user/detail'], { queryParams: { "detail": id } });
  }
  onLikeClick() { }

  onCommentClick(id: string) {
    this.router.navigate(['/user/detail'], { fragment: 'bookmark', queryParams: { "detail": id } });
  }

  onUpdateClick(id: string) {
    console.log(id);
    this.router.navigate(['/user/update'], { queryParams: { "detail": id } });
  }
  onDeleteClick(_t8: any) {
  }
  
  onBookNowClick(id: string) {
    this.router.navigate(['/user/book'], { queryParams: { 'detail': id , 'id': this.userId} });
  }

  onFollowNowClick(id: string) {
    
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
}
