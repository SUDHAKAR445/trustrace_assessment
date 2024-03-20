import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/model/recipe.model';
import { AlertService } from 'src/app/services/alert.service';
import { CommentService } from 'src/app/services/comment.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements AfterViewInit {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  recipeService: RecipeService = inject(RecipeService);
  commentService: CommentService = inject(CommentService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  recipeId!: string | null;
  recipeDetail!: Recipe;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Commented Text', 'Commented Date', 'Likes'];
  dataSource = new MatTableDataSource<Comment>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.recipeId = data.get('detail');
    })

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        this.recipeDetail = response;
      },
      error: (error) => {
        this.alertService.showError("Error in loading in recipe detail");
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
    this.commentService.getAllComments(this.recipeId, pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error in loading the comments of this recipe");
      }
    })
  }

  onCancelClicked() {
    window.history.back();
  }

  updateRecipeClicked(id: string) {
    this.alertService.confirm("Confirm", "Are you sure you want to update this recipe?").then((confirmed) => {
      if (confirmed) {
        this.router.navigate(['/admin/recipes/update'], { queryParams: { detail: id } });
      }
    });
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showUserDetail(id: string) {
    this.router.navigate(['admin/users/detail'], { queryParams: { detail: id } });
  }
}
