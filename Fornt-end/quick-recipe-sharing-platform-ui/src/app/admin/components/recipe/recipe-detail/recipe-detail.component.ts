import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/model/recipe.model';
import { CommentService } from 'src/app/services/comment.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent {
  
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  recipeService: RecipeService =inject(RecipeService);

  recipeId!: string | null;

  recipeDetail!: Recipe;

  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'Commented Text', 'Commented Date', 'Likes'];
  dataSource = new MatTableDataSource<Comment>();

  router: Router = inject(Router);


  constructor(private commentService: CommentService, private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.recipeId = data.get('detail');
    })

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        this.recipeDetail = response;
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
    this.commentService.getAllComments(this.recipeId, pageIndex, pageSize).subscribe({
      next: (response) => {
        console.log(response.content);
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
