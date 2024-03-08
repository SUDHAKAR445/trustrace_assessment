import { Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ConfirmDialogComponent } from 'src/app/utility/confirm-dialog/confirm-dialog.component';
import { ReportDialogComponent } from 'src/app/utility/report-dialog/report-dialog.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  constructor(private recipeService: RecipeService, private dialog: MatDialog) { };

  authService: AuthService = inject(AuthService);
  commentService: CommentService = inject(CommentService);
  activateRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  recipes: any[] = [];
  page = 0;
  pageSize = 10;
  isLoading = false;
  errorMessage!: string | null;
  userId!: string | null | undefined;
  searchText!: string | null;
  searchCuisine!: string | null;
  searchCategory!: string | null;
  hasLoadedInitialData: boolean = false;
  showNoBookingsMessage: boolean = false;

  ngOnInit(): void {

    this.authService.user.subscribe((data) => {
      this.userId = data?.userId;
    })

    this.activateRoute.queryParamMap.subscribe((data) => {
      this.searchText = data.get('search');
      this.searchCategory = data.get('category');
      this.searchCuisine = data.get('cuisine');
    });

    this.loadRecipes();
  }

  loadRecipes(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.recipeService.getAllRecipeBySearch(this.searchText, this.searchCuisine, this.searchCategory, null, null, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.recipes = [...this.recipes, ...response.content];
        this.page++;
        this.isLoading = false;
        if (!this.hasLoadedInitialData && response.content.length === 0) {
          const delayTime = 500;

          setTimeout(() => {
            this.showNoBookingsMessage = true;
          }, delayTime);
        }

        this.hasLoadedInitialData = true;

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
      this.loadRecipes();
    }
  }

  onShowDetailClicked(id: string) {
    this.router.navigate(['/user/detail'], { queryParams: { "detail": id } });
  }
  onLikeClick() { }

  onCommentClick() { }

  onUpdateClick(id: string) {
    console.log(id);
    this.router.navigate(['/user/update'], { queryParams: { "detail": id } });
  }
  onDeleteClick(_t8: any) {
  }

  onBookNowClick(_t8: any) {
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