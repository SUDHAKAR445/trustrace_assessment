import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuisine } from 'src/app/model/cuisine.model';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { AlertService } from 'src/app/services/alert.service';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-cuisine-detail',
  templateUrl: './cuisine-detail.component.html',
  styleUrls: ['./cuisine-detail.component.scss']
})
export class CuisineDetailComponent implements AfterViewInit{

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  cuisineService: CuisineService = inject(CuisineService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  cuisineId!: string | null;
  cuisineDetail!: Cuisine;
  createUserClicked: boolean = false;

  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Category', 'Cuisine'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.cuisineId = data.get('detail');
    })

    this.cuisineService.getCuisineDetailsById(this.cuisineId).subscribe({
      next: (response) => {
        this.cuisineDetail = response;
      },
      error: (error) => {
        this.alertService.showError("Failed to load Cuisine Detail");
      }
    })

    if (this.paginator) {
      this.paginator.page.subscribe({
        next: (page: any) => this.loadPage(page.pageIndex, page.pageSize)
      });
      this.loadPage(0, 2);
    }
    this.changeDetectorRef.detectChanges();
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.cuisineService.getRecipeByCuisine(this.cuisineId, pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Failed to Load the Recipes present in this Cuisine");
      }
    })
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showUserDetail(id: string) {
    this.router.navigate(['admin/users/detail'],  { queryParams: { detail: id }});
  }
}
