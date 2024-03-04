import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuisine } from 'src/app/model/cuisine.model';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-cuisine-detail',
  templateUrl: './cuisine-detail.component.html',
  styleUrls: ['./cuisine-detail.component.scss']
})
export class CuisineDetailComponent {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  cuisineId!: string | null;

  cuisineDetail!: Cuisine;

  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Category', 'Cuisine'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  router: Router = inject(Router);

  constructor(private cuisineService: CuisineService, private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.cuisineId = data.get('detail');
      console.log(this.cuisineId);
    })

    this.cuisineService.getCuisineDetailsById(this.cuisineId).subscribe({
      next: (response) => {
        this.cuisineDetail = response;
        console.log(response);
      },
      error: (error) => {
        console.log(error);
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
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
