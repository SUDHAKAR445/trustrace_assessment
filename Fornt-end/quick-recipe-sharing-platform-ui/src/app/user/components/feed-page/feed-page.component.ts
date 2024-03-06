import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss']
})
export class FeedPageComponent implements OnInit {

  constructor(private recipeService: RecipeService) { }
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  recipes: any[] = [];
  page = 0;
  pageSize = 10;
  isLoading = false;
  errorMessage!: string | null;
  userId!: string | null | undefined;

  ngOnInit(): void {
    
    this.authService.user.subscribe((data) => {
      this.userId = data?.userId;
    })
    this.loadRecipes();
  }

  loadRecipes(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.recipeService.getAllRecipe(this.page, this.pageSize).subscribe({
      next: (response) => {
        this.recipes = [...this.recipes, ...response.content];
        this.page++;
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
      this.loadRecipes();
    }
  }

  onLikeClick() { }

  onCommentClick() { }

  onUpdateClick(id: string) {
    console.log(id);
    this.router.navigate(['/user/update'], { queryParams: { "detail": id }});
  }
  onDeleteClick(_t8: any) {
  }
  onReportClick(_t8: any) {
  }
  onBookNowClick(_t8: any) {
  }
  onSaveClick(_t8: any) {
  }
}
