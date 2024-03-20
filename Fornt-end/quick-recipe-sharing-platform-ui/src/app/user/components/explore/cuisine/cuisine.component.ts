import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Explore } from 'src/app/model/cuisine.model';
import { AlertService } from 'src/app/services/alert.service';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-cuisine',
  templateUrl: './cuisine.component.html',
  styleUrls: ['./cuisine.component.scss']
})
export class CuisineComponent implements OnInit{

  cuisineService: CuisineService = inject(CuisineService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  cuisineExplore!: Explore[];
  groupedCuisines: { [key: string]: Explore[] } = {};
  alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  ngOnInit() {
    this.cuisineService.exploreByCuisine().subscribe({
      next: (response) => {
        this.cuisineExplore = response;
        this.groupCuisines();
      },
      error: (error) => {
        this.alertService.showError('Error occurred in showing the cuisine list');
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
