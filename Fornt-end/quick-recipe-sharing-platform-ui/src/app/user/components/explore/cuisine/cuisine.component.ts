import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Explore } from 'src/app/model/cuisine.model';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-cuisine',
  templateUrl: './cuisine.component.html',
  styleUrls: ['./cuisine.component.scss']
})
export class CuisineComponent {
  alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  cuisineService: CuisineService = inject(CuisineService);
  errorMessage!: string | null;

  cuisineExplore!: Explore[];
  groupedCuisines: { [key: string]: Explore[] } = {};
  router: Router = inject(Router);

  ngOnInit() {
    this.cuisineService.exploreByCuisine().subscribe({
      next: (response) => {
        this.cuisineExplore = response;
        this.groupCuisines();
        console.log(this.groupedCuisines);
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  groupCuisines() {
    this.groupedCuisines = this.cuisineExplore.reduce((acc: { [key: string]: Explore[] }, cuisine) => {
      const firstLetter: string = (cuisine.name as string)[0].toUpperCase();
      acc[firstLetter] = acc[firstLetter] || [];
      acc[firstLetter].push(cuisine);
      return acc;
    }, {} as { [key: string]: Explore[] });
  }

  onSearch(cuisine: string) {
    this.router.navigate(['/user/search'], { queryParams: { 'cuisine': cuisine } });
  }
}
