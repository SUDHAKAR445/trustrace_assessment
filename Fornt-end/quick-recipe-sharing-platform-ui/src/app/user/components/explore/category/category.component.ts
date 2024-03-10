import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Explore } from 'src/app/model/cuisine.model';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  router: Router = inject(Router);
  categoryService: CategoryService = inject(CategoryService);
  alertService: AlertService = inject(AlertService);
  
  categoryExplore!: Explore[];
  groupedCategories: { [key: string]: Explore[] } = {};
  alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  ngOnInit() {
    this.categoryService.exploreByCategory().subscribe({
      next: (response) => {
        this.categoryExplore = response;
        this.groupCategories();
      },
      error: (error) => {
        this.alertService.showSuccess('Error occurred in showing the category list');
      }
    });
  }

  groupCategories() {
    this.groupedCategories = this.categoryExplore.reduce((acc: { [key: string]: Explore[] }, category) => {
      const firstLetter: string = (category.name as string)[0].toUpperCase();
      acc[firstLetter] = acc[firstLetter] || [];
      acc[firstLetter].push(category);
      return acc;
    }, {} as { [key: string]: Explore[] });
  }

  onSearch(category: string) {
    this.router.navigate(['/user/search'], { queryParams: { 'category': category } });
  }
}
