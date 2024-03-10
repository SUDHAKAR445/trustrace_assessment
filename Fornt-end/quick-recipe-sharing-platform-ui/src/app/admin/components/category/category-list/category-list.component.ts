import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements AfterViewInit {

  categoryService: CategoryService = inject(CategoryService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Category Name', 'Total Recipe Posted'];
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('message') messageRef!: ElementRef;

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe({
        next: (page: any) => this.loadPage(page.pageIndex, page.pageSize)
      });
      this.loadPage(0, 10);
    }
    this.messageRef.nativeElement.addEventListener('input', () => {
      const inputValue = this.messageRef.nativeElement.value;
      
      if (inputValue.trim() === '') {
        this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.makeApiCall(inputValue, this.paginator.pageIndex, this.paginator.pageSize);
      }
    });
  }

  makeApiCall(inputValue: string, pageIndex: number, pageSize: number) {

    this.categoryService.searchCategory(inputValue, pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error in applying the filter");
      }
    })
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.categoryService.getAllCategoryList(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Failed to load Category list");
      }
    })
  }

  onCreateClicked() {
    this.router.navigate(['/admin/categories/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/categories/detail'], {queryParams:{detail: id}});
  }
}