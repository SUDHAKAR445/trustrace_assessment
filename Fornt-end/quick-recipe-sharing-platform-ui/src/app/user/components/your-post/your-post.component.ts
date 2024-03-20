import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { FollowService } from 'src/app/services/follow.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-your-post',
  templateUrl: './your-post.component.html',
  styleUrls: ['./your-post.component.scss']
})
export class YourPostComponent implements OnInit, OnDestroy {

  dialog: MatDialog = inject(MatDialog);
  recipeService: RecipeService = inject(RecipeService);
  authService: AuthService = inject(AuthService);
  commentService: CommentService = inject(CommentService);
  router: Router = inject(Router);
  followService: FollowService = inject(FollowService);
  alertService: AlertService = inject(AlertService);

  recipes: any[] = [];
  page = 0;
  pageSize = 10;
  isLoading = false;
  userId!: string;
  followerList!: User[] | null;
  followingList!: User[] | null;
  likedRecipes!: string[] | null;
  userIdSubscription!: Subscription;
  followerListSubscription!: Subscription;
  followingListSubscription!: Subscription;
  likedRecipesSubscription!: Subscription;

  ngOnInit(): void {

    this.userIdSubscription = this.authService.user.subscribe((data) => {
      this.userId = data?.id || '';
    });

    this.followerListSubscription = this.authService.followers.subscribe((data) => {
      this.followerList = data;
    });

    this.followingListSubscription = this.authService.following.subscribe((data) => {
      this.followingList = data;
    });

    this.likedRecipesSubscription = this.authService.likedRecipes.subscribe((data) => {
      this.likedRecipes = data;
    });
    this.loadRecipes();
  }

  loadRecipes(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.recipeService.getAllRecipeByUserId(this.userId, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.recipes = [...this.recipes, ...response.content];
        this.page++;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.alertService.showError('Error in displaying your recipes');
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

  showUserDetail(id: string | undefined) {
    this.router.navigate(['/user/bio'], { queryParams: { 'id': id } });
  }

  ngOnDestroy(){
    this.userIdSubscription.unsubscribe();
    this.followerListSubscription.unsubscribe();
    this.followingListSubscription.unsubscribe();
    this.likedRecipesSubscription.unsubscribe();
  }
}
