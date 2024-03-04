import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileDetailComponent } from './components/profile/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { CommentComponent } from './components/report/comment/comment.component';
import { RecipeComponent } from './components/report/recipe/recipe.component';
import { ReportDetailComponent } from './components/report/report-detail/report-detail.component';
import { UserComponent } from './components/report/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardContentComponent },
      {
        path: 'profile',
        children: [
          { path: '', component: ProfileDetailComponent },
          { path: 'update', component: ProfileEditComponent },
        ]
      },
      {
        path: 'report',
        children: [
          { path: 'comments', component: CommentComponent },
          { path: 'recipes', component: RecipeComponent },
          { path: 'users', component: UserComponent },
          { path: 'comments/detail', component: ReportDetailComponent },
          { path: 'recipes/detail', component: ReportDetailComponent },
          { path: 'users/detail', component: ReportDetailComponent },
        ]
      },
      { path: '**', redirectTo: '/not-found' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeratorRoutingModule { }
