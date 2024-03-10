import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { LoadComponent } from '../utility/load/load.component';
import { SnackbarComponent } from '../utility/snackbar/snackbar.component';
import { VideoPlayerComponent } from '../utility/video-player/video-player.component';
import { BookingsDetailComponent } from './components/bookings-detail/bookings-detail.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { CategoryComponent } from './components/explore/category/category.component';
import { CuisineComponent } from './components/explore/cuisine/cuisine.component';
import { ExploreComponent } from './components/explore/explore.component';
import { FeedPageComponent } from './components/feed-page/feed-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { PaymentComponent } from './components/payment/payment.component';
import { RecipeCreateComponent } from './components/recipe/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './components/recipe/recipe-detail/recipe-detail.component';
import { RecipeUpdateComponent } from './components/recipe/recipe-update/recipe-update.component';
import { SavedRecipeComponent } from './components/saved-recipe/saved-recipe.component';
import { SearchComponent } from './components/search/search.component';
import { UserRoutingModule } from './user-routing.module';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { YourPostComponent } from './components/your-post/your-post.component';
import { FollowerListComponent } from './components/follower-list/follower-list.component';
import { FollowingListComponent } from './components/following-list/following-list.component';
import { DetailComponent } from './components/detail/detail.component';
import { BioComponent } from './components/bio/bio.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FeedPageComponent,
    RecipeCreateComponent,
    BookingsComponent,
    BookingsDetailComponent,
    RecipeUpdateComponent,
    RecipeDetailComponent,
    SavedRecipeComponent,
    ExploreComponent,
    CategoryComponent,
    CuisineComponent,
    SearchComponent,
    PaymentComponent,
    ProfileEditComponent,
    YourPostComponent,
    FollowerListComponent,
    FollowingListComponent,
    DetailComponent,
    BioComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
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
    MatStepperModule,
    MatExpansionModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
  ]
})
export class UserModule { }
