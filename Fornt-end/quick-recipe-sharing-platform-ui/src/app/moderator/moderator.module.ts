import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModeratorRoutingModule } from './moderator-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { LoadComponent } from '../utility/load/load.component';
import { SnackbarComponent } from '../utility/snackbar/snackbar.component';
import { VideoPlayerComponent } from '../utility/video-player/video-player.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserComponent } from './components/report/user/user.component';
import { RecipeComponent } from './components/report/recipe/recipe.component';
import { CommentComponent } from './components/report/comment/comment.component';
import { ReportDetailComponent } from './components/report/report-detail/report-detail.component';
import { ProfileDetailComponent } from './components/profile/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardContentComponent,
    HeaderComponent,
    SidebarComponent,
    UserComponent,
    RecipeComponent,
    CommentComponent,
    ReportDetailComponent,
    ProfileDetailComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    ModeratorRoutingModule,
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
export class ModeratorModule { }
