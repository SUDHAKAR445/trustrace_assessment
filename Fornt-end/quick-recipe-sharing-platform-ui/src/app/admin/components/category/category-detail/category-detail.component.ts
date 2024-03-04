import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  categoryId!: string | null;

  categoryDetail!: Category;

  errorMessage!: string | null;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Category', 'Cuisine'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  router: Router = inject(Router);

  constructor(private categoryService: CategoryService, private changeDetectorRef: ChangeDetectorRef) {
  }

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
    this.categoryService.getRecipeByCategory(this.categoryId, pageIndex, pageSize).subscribe({
      next: (response) => {
        // console.log(response.content);
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
    this.router.navigate(['admin/users/detail'], { queryParams: { detail: id } });
  }
}

