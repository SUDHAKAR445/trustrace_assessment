import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoadComponent } from '../utility/load/load.component';
import { SnackbarComponent } from '../utility/snackbar/snackbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { UserUpdateComponent } from './components/user/user-update/user-update.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component'
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CuisineListComponent } from './components/cuisine/cuisine-list/cuisine-list.component';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { CuisineDetailComponent } from './components/cuisine/cuisine-detail/cuisine-detail.component';
import { CuisineCreateComponent } from './components/cuisine/cuisine-create/cuisine-create.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryCreateComponent } from './components/category/category-create/category-create.component';
import { CategoryDetailComponent } from './components/category/category-detail/category-detail.component';
import { RecipeDetailComponent } from './components/recipe/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './components/recipe/recipe-list/recipe-list.component';
import { RecipeUpdateComponent } from './components/recipe/recipe-update/recipe-update.component';
import { VideoPlayerComponent } from '../utility/video-player/video-player.component';
import { ProfileDetailComponent } from './components/profile/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { MatDividerModule } from '@angular/material/divider';
import { RecipeComponent } from './components/report/recipe/recipe.component';
import { CommentComponent } from './components/report/comment/comment.component';
import { UserComponent } from './components/report/user/user.component';
import { TransactionListComponent } from './components/transaction/transaction-list/transaction-list.component';
import { TransactionDetailComponent } from './components/transaction/transaction-detail/transaction-detail.component';
import { ReportDetailComponent } from './components/report/report-detail/report-detail.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [

    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    UserCreateComponent,
    UserUpdateComponent,
    UserDetailComponent,
    UserListComponent,
    DashboardContentComponent,
    CuisineListComponent,
    CuisineDetailComponent,
    CuisineCreateComponent,
    CategoryListComponent,
    CategoryCreateComponent,
    CategoryDetailComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeUpdateComponent,
    ProfileDetailComponent,
    ProfileEditComponent,
    RecipeComponent,
    CommentComponent,
    UserComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    ReportDetailComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatTableModule,
    LoadComponent,
    SnackbarComponent,
    MatPaginatorModule,
    MatSelectModule,
    MatRadioModule,
    VideoPlayerComponent,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class AdminModule { }
