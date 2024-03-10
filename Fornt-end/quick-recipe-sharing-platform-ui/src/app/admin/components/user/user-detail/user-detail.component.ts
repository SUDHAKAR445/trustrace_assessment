import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeCuisine } from 'src/app/model/recipe-cuisine.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  userService: UserService = inject(UserService);
  recipeService: RecipeService = inject(RecipeService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  userId!: string | null;
  userDetail!: User;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Title', 'Date Created', 'Deleted At', 'Category', 'Cuisine', 'Actions'];
  dataSource = new MatTableDataSource<RecipeCuisine>();

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.userId = data.get('detail');
    })

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.userDetail = response;
      },
      error: (error) => {
        this.alertService.showError("Error occurred in getting user detail");
      }
    })
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
        this.alertService.showError("Error occurred in loading user's recipes");
      }
    });
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showUserDetail(id: string) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { detail: id } });
  }

  onDeleteClicked(id: string, deletedAt: string | null) {
    if(!deletedAt){
      this.alertService.confirm("Confirm","Are you sure you want to delete this recipe?").then((confirmed) => {
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
      this.alertService.confirm("Confirm","Are you sure you want to revoke this recipe?").then((confirmed) => {
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

  onEditUserClicked(id: string | undefined) {
    this.alertService.confirm('Confirm', 'Are you sure do want edit this user').then((isConfirmed) => {
      if(isConfirmed) {
        this.router.navigate(['/admin/users/update'], { queryParams: { detail: id } });
      }
    });
  }

  onCancelClicked(){
    window.history.go(-1);
  }

  onEditClicked(id: string | undefined) {
    this.alertService.confirm('Confirm', 'Are you sure do want edit this recipe').then((isConfirmed) => {
      if(isConfirmed) {
        this.router.navigate(['/admin/recipes/update'], { queryParams: { detail: id } });
      }
    });
  }
}

