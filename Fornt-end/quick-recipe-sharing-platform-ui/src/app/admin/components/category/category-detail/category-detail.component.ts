import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements AfterViewInit {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  categoryService: CategoryService = inject(CategoryService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  categoryId!: string | null;
  categoryDetail!: Category;

  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Category', 'Cuisine'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.categoryId = data.get('detail');
      console.log(this.categoryId);
    })

    this.categoryService.getCategoryDetailsById(this.categoryId).subscribe({
      next: (response) => {
        this.categoryDetail = response;
        console.log(response);
      },
      error: (error) => {
      }
    })

    if (this.paginator) {
      this.paginator.page.subscribe({
        next: (page: any) => this.loadPage(page.pageIndex, page.pageSize)
      });
      this.loadPage(0, 10);
    }
    this.changeDetectorRef.detectChanges();
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.categoryService.getRecipeByCategory(this.categoryId, pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Failed to Load the Recipes present in this Category");
      }
    })
  }


  showDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showUserDetail(id: string) {
    this.router.navigate(['admin/users/detail'], { queryParams: { detail: id } });
  }

  onCancelClicked() {
    window.history.go(-1);
  }
}

