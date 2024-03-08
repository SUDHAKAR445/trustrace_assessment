import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
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

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements AfterViewInit {
  constructor(
    private recipeService: RecipeService,
    private changeDetectorRef: ChangeDetectorRef,
    private categoryService: CategoryService,
    private cuisineService: CuisineService
  ) { }

  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Deleted At', 'Category', 'Cuisine', 'Actions'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  router: Router = inject(Router);

  selectedCuisine!: string;
  selectedCategory!: string;
  cuisines!: Cuisine[];
  categories!: Category[];

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year - 1, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('message') messageRef!: ElementRef;

  ngOnInit() {
    this.categoryService.getAllCategoryList(0, 100).subscribe((data) => {
      this.categories = data.content;
      console.log(this.categories);
    });

    this.cuisineService.getAllCuisineList(0, 100).subscribe((data) => {
      this.cuisines = data.content;
      console.log(this.cuisines);
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe({
        next: (page: any) => this.loadPage(page.pageIndex, page.pageSize),
      });
      this.loadPage(0, 10);
    }
    this.changeDetectorRef.detectChanges();

    this.messageRef.nativeElement.addEventListener('input', () => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const inputValue = this.messageRef.nativeElement.value;
    if (!this.selectedCategory && !this.selectedCuisine && !this.campaignOne.value && !inputValue.trim()) {
      this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.makeApiCall(inputValue, this.selectedCuisine, this.selectedCategory, this.campaignOne.value.start, this.campaignOne.value.end);
    }
  }

  makeApiCall(
    inputValue: any,
    selectedCuisine: string,
    selectedCategory: string,
    start: Date | null | undefined,
    end: Date | null | undefined
  ) {
    console.log(start);

    this.recipeService.getAllRecipeBySearch(inputValue, selectedCuisine, selectedCategory, start, end, this.paginator.pageIndex, this.paginator.pageSize).subscribe({
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
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
    this.router.navigate(['/admin/recipes/update'], { queryParams: { detail: id } });
  }

  onDeleteClicked(id: string) {
    this.recipeService.deleteRecipeById(id).subscribe({
      next: () => {
        this.router.navigate(['/admin/recipes']);
      },
      error: (error) => {
        this.router.navigate(['/admin/recipes']);
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.campaignOne.patchValue({
      start: event.value,
    });
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.campaignOne.patchValue({
      end: event.value,
    });
  }

  onDateChange() {
    this.applyFilters();
  }
}
