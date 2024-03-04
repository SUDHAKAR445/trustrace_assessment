import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { User } from 'src/app/model/user-detail';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {

  constructor(private recipeService: RecipeService, private changeDetectorRef: ChangeDetectorRef) {
  }
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  userService: UserService =inject(UserService);

  userId!: string | null;

  userDetail!: User;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Deleted At', 'Category', 'Cuisine', 'Actions'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  router: Router = inject(Router);

  


  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.userId = data.get('detail');
    })

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.userDetail = response;
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onUpdateClicked(id: string, status: string) {
    
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe({
        next: (page: any) => this.loadPage(page.pageIndex, page.pageSize)
      });
      this.loadPage(0, 10);
    }
    this.changeDetectorRef.detectChanges();
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.recipeService.getAllRecipeByUserId(this.userId, pageIndex, pageSize).subscribe({
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

  onCreateClicked() {
    this.router.navigate(['/admin/recipes/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showUserDetail(id: string) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { detail: id } });
  }

  onDeleteClicked(id: string) {

  }

  onEditUserClicked(id: string | undefined) {
    this.router.navigate(['/admin/users/update'], { queryParams: { detail: id } });
  }

  onCancelClicked(){
    window.history.go(-1);
  }

  onEditClicked(id: string | undefined) {
    this.router.navigate(['/admin/recipes/update'], { queryParams: { detail: id } });
  }
}

