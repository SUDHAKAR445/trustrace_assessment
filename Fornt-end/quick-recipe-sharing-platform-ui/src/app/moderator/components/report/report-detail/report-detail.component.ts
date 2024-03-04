import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { Comment } from 'src/app/model/comment.model';
import { Recipe } from 'src/app/model/recipe.model';
import { Report } from 'src/app/model/report.model';
import { User } from 'src/app/model/user-detail';
import { CommentService } from 'src/app/services/comment.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  reportService: ReportService = inject(ReportService);
  userService: UserService = inject(UserService);
  recipeService: RecipeService = inject(RecipeService);
  commentService: CommentService = inject(CommentService);

  router: Router = inject(Router);

  reportId!: string | null;
  type!: string;

  reportDetail: {
    report: Report,
    reporterUser: User,
    reportedUser?: User,
    reportedRecipe?: Recipe,
    reportedComment?: Comment
  } = {
      report: {} as Report,
      reporterUser: {} as User,
      reportedUser: undefined,
      reportedRecipe: undefined,
      reportedComment: undefined
    };

  ngAfterViewInit() {
    this.activeRoute.queryParamMap.pipe(
      switchMap((data) => {
        this.reportId = data.get('detail');
        return this.reportService.getReportById(this.reportId);
      }),
      switchMap((report) => {
        this.reportDetail.report = report;

        const observables = [];

        if (report.reporterUserId) {
          observables.push(this.userService.getUserById(report.reporterUserId));
        }

        if (report.recipeId) {
          this.type = 'recipes';
          observables.push(this.recipeService.getRecipeById(report.recipeId));
        }

        if (report.reportedUserId) {
          this.type = 'users';
          observables.push(this.userService.getUserById(report.reportedUserId));
        }

        if (report.commentId) {
          this.type = 'comments';
          observables.push(this.commentService.getCommentById(report.commentId));
        }

        return forkJoin(observables);
      })
    ).subscribe({
      next: (responses) => {
        if (responses.length > 0) {
          this.reportDetail.reporterUser = responses[0] as User;
        }
        if (this.type === 'recipes') {
          this.reportDetail.reportedRecipe = responses[1] as Recipe;
        }
        if (this.type === 'users') {
          this.reportDetail.reportedUser = responses[1] as User;
        }
        if (this.type === 'comments') {

          this.reportDetail.reportedComment = responses[1] as Comment;

        }
        console.log(this.reportDetail);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateStatusClicked(id: string | undefined , value: string) {
    this.reportService.updateReportStatusById(id, value).subscribe({
      next : (response) => {
        this.router.navigate([`/moderator/report/${this.type}`]);
      },
      error: (error) => {
        this.router.navigate([`/moderator/report/${this.type}`]);
      }
    })
  }
}
