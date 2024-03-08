import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Explore } from 'src/app/model/cuisine.model';
import { CategoryService } from 'src/app/services/category.service';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {

  categoryService: CategoryService = inject(CategoryService);
  cuisineService: CuisineService = inject(CuisineService);
  router: Router = inject(Router);

  cuisineExplore!: Explore[];
  categoryExplore!: Explore[];
  errorMessage!: string | null;

  ngOnInit() {
    this.categoryService.exploreByCategory().subscribe({
      next: (response) => {
        this.categoryExplore = response;
        console.log(this.categoryExplore);

      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });

    this.cuisineService.exploreByCuisine().subscribe({
      next: (response) => {
        this.cuisineExplore = response;
        console.log(this.cuisineExplore);

      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  onCuisineClick(searchText: string) {
    this.router.navigate(['/user/search'], { queryParams: { 'cuisine': searchText } });
  }

  
  onCategoryClick(searchText: string) {
    this.router.navigate(['/user/search'], { queryParams: { 'category': searchText } });
  }
}
