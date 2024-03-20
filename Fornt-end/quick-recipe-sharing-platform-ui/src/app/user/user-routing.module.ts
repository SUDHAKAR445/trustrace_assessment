import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsDetailComponent } from './components/bookings-detail/bookings-detail.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { CategoryComponent } from './components/explore/category/category.component';
import { CuisineComponent } from './components/explore/cuisine/cuisine.component';
import { ExploreComponent } from './components/explore/explore.component';
import { FeedPageComponent } from './components/feed-page/feed-page.component';
import { HomeComponent } from './components/home/home.component';
import { PaymentComponent } from './components/payment/payment.component';
import { RecipeCreateComponent } from './components/recipe/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './components/recipe/recipe-detail/recipe-detail.component';
import { RecipeUpdateComponent } from './components/recipe/recipe-update/recipe-update.component';
import { SavedRecipeComponent } from './components/saved-recipe/saved-recipe.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { YourPostComponent } from './components/your-post/your-post.component';
import { FollowerListComponent } from './components/follower-list/follower-list.component';
import { FollowingListComponent } from './components/following-list/following-list.component';
import { DetailComponent } from './components/detail/detail.component';
import { BioComponent } from './components/bio/bio.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedPageComponent },
      { path: 'create', component: RecipeCreateComponent, canDeactivate: [(comp: RecipeCreateComponent) => {return comp.canExit()}] },
      { path: 'detail', component: RecipeDetailComponent },
      { path: 'update', component: RecipeUpdateComponent, canDeactivate: [(comp: RecipeUpdateComponent) => {return comp.canExit()}] },
      { path: 'saved', component: SavedRecipeComponent },
      { path: 'book', component: PaymentComponent, canDeactivate: [(comp: PaymentComponent) => {return comp.canExit()}] },
      { path: 'followers', component: FollowerListComponent },
      { path: 'following', component: FollowingListComponent },
      { path: 'bio', component: BioComponent },
      { path: 'post', component: DetailComponent },
      {
        path: 'search', component: SearchComponent,
        runGuardsAndResolvers: 'always'
      },
      { path: 'profile/edit', component: ProfileEditComponent, canDeactivate: [(comp: ProfileEditComponent) => {return comp.canExit()}] },
      { path: 'recipes', component: YourPostComponent },
      {
        path: 'explore',
        children: [
          { path: '', component: ExploreComponent },
          { path: 'category', component: CategoryComponent },
          { path: 'cuisine', component: CuisineComponent },
        ]
      },
      {
        path: 'booking',
        children: [
          { path: '', component: BookingsComponent },
          { path: 'detail', component: BookingsDetailComponent }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
