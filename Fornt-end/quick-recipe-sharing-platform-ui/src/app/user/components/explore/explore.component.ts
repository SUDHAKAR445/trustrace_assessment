import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Explore } from 'src/app/model/cuisine.model';
import { AlertService } from 'src/app/services/alert.service';
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
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  cuisineExplore!: Explore[];
  categoryExplore!: Explore[];

  ngOnInit() {
    this.categoryService.exploreByCategory().subscribe({
      next: (response) => {
        this.categoryExplore = response;

      },
      error: (error) => {
        this.alertService.showError('Error occurred in showing the explore page');
      }
    });

    this.cuisineService.exploreByCuisine().subscribe({
      next: (response) => {
        this.cuisineExplore = response;
      },
      error: (error) => {
        this.alertService.showError('Error occurred in showing the explore page');
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
