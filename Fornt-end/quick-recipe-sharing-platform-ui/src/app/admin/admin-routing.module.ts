import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { UserUpdateComponent } from './components/user/user-update/user-update.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { CuisineListComponent } from './components/cuisine/cuisine-list/cuisine-list.component';
import { CuisineDetailComponent } from './components/cuisine/cuisine-detail/cuisine-detail.component';
import { CuisineCreateComponent } from './components/cuisine/cuisine-create/cuisine-create.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryDetailComponent } from './components/category/category-detail/category-detail.component';
import { CategoryCreateComponent } from './components/category/category-create/category-create.component';
import { RecipeListComponent } from './components/recipe/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe/recipe-detail/recipe-detail.component';
import { RecipeUpdateComponent } from './components/recipe/recipe-update/recipe-update.component';
import { ProfileDetailComponent } from './components/profile/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { CommentComponent } from './components/report/comment/comment.component';
import { RecipeComponent } from './components/report/recipe/recipe.component';
import { UserComponent } from './components/report/user/user.component';
import { TransactionListComponent } from './components/transaction/transaction-list/transaction-list.component';
import { TransactionDetailComponent } from './components/transaction/transaction-detail/transaction-detail.component';
import { ReportDetailComponent } from './components/report/report-detail/report-detail.component';
import { RecipeCreateComponent } from './components/recipe/recipe-create/recipe-create.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardContentComponent },
      {
        path: 'users',
        children: [
          { path: '', component: UserListComponent },
          { path: 'create', component: UserCreateComponent },
          { path: 'update', component: UserUpdateComponent },
          { path: 'detail', component: UserDetailComponent },
        ],
      },
      {
        path: 'cuisines',
        children: [
          { path: '', component: CuisineListComponent },
          { path: 'detail', component: CuisineDetailComponent },
          { path: 'create', component: CuisineCreateComponent },
        ]
      },
      {
        path: 'categories',
        children: [
          { path: '', component: CategoryListComponent },
          { path: 'detail', component: CategoryDetailComponent },
          { path: 'create', component: CategoryCreateComponent },
        ]
      },
      {
        path: 'recipes',
        children: [
          { path: '', component: RecipeListComponent },
          { path: 'create', component: RecipeCreateComponent },
          { path: 'detail', component: RecipeDetailComponent },
          { path: 'update', component: RecipeUpdateComponent },
        ]
      },
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
      {
        path: 'transactions',
        children: [
          { path: '', component: TransactionListComponent },
          { path: 'detail', component: TransactionDetailComponent },
        ]
      },
      // Add a wildcard route for unknown paths
      { path: '**', redirectTo: '/not-found' },
    ]
  },
  // Add a wildcard route for unknown paths outside of the dashboard
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
