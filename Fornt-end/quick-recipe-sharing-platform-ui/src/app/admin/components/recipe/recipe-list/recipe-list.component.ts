import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category.model';
import { Cuisine } from 'src/app/model/cuisine.model';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { CategoryService } from 'src/app/services/category.service';
import { CuisineService } from 'src/app/services/cuisine.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { AlertService } from 'src/app/services/alert.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements AfterViewInit, OnInit {
  recipeService:RecipeService = inject(RecipeService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  categoryService: CategoryService = inject(CategoryService);
  cuisineService: CuisineService = inject(CuisineService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Deleted At', 'Category', 'Cuisine', 'Actions'];
  dataSource = new MatTableDataSource<RecipeCuisine>();
  selectedCuisine!: string;
  selectedCategory!: string;
  cuisines!: Cuisine[];
  categories!: Category[];

  filterDate = new FormGroup({
    start: new FormControl(new Date(year - 1, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('message') messageRef!: ElementRef;

  ngOnInit() {
    this.categoryService.getAllCategoryList(0, 100).subscribe((data) => {
      this.categories = data.content;
    });

    this.cuisineService.getAllCuisineList(0, 100).subscribe((data) => {
      this.cuisines = data.content;
    });
  }

  ngAfterViewInit() {
    this.loadPage(0, 10);
    this.changeDetectorRef.detectChanges();

    this.messageRef.nativeElement.addEventListener('input', () => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const inputValue = this.messageRef.nativeElement.value;
    if (!this.selectedCategory && !this.selectedCuisine && !this.filterDate.value && !inputValue.trim()) {
      this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.makeApiCall(inputValue, this.selectedCuisine, this.selectedCategory, this.filterDate.value.start, this.filterDate.value.end);
    }
  }

  makeApiCall(
    inputValue: any,
    selectedCuisine: string,
    selectedCategory: string,
    start: Date | null | undefined,
    end: Date | null | undefined
  ) {
    this.recipeService.getAllRecipeBySearch(inputValue, selectedCuisine, selectedCategory, start, end, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error in applying the filter");
      },
    });
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.recipeService.getAllRecipe(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error occurred in loading the recipeList");
      },
    });
  }

  onCreateClicked() {
    this.router.navigate(['/admin/recipes/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showUserDetail(id: string) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { detail: id } });
  }

  onEditClicked(id: string) {
    this.alertService.confirm("Confirm","Are you sure you want to edit this recipe?").then((confirmed) => {
      if(confirmed) {
        this.router.navigate(['/admin/recipes/update'], { queryParams: { detail: id } });
      }
    });
  }

  onDeleteClicked(id: string, deletedAt: string | null) {
    if(!deletedAt){
      this.alertService.confirmDelete("Confirm","Are you sure you want to delete this recipe?").then((confirmed) => {
        if (confirmed) {
          this.recipeService.deleteRecipeById(id).subscribe({
            next: () => {
              this.alertService.showSuccess("Recipe deleted successfully");
              window.history.go(-1);
            },
            error: (error) => {
              this.alertService.showError("Error occurred in delete the recipe");
              window.history.go(-1);
            },
          });
        } else {
          window.history.go(-1);
        }
      });
    } else {
      this.alertService.confirmDelete("Confirm","Are you sure you want to revoke this recipe?").then((confirmed) => {
        if (confirmed) {
          this.recipeService.deleteRecipeById(id).subscribe({
            next: () => {
              this.alertService.showSuccess("Recipe revoked successfully");
              window.history.go(-1);
            },
            error: (error) => {
              this.alertService.showError("Error occurred in revoke the recipe");
              window.history.go(-1);
            },
          });
        } else {
          window.history.go(-1);
        }
      });
    }
  }
  
  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.filterDate.patchValue({
      start: event.value,
    });
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.filterDate.patchValue({
      end: event.value,
    });
  }

  onDateChange() {
    this.applyFilters();
  }
}
