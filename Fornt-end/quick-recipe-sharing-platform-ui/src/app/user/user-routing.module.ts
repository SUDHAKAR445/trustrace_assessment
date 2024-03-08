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

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedPageComponent },
      { path: 'create', component: RecipeCreateComponent },
      { path: 'detail', component: RecipeDetailComponent },
      { path: 'update', component: RecipeUpdateComponent },
      { path: 'saved', component: SavedRecipeComponent },
      { path: 'book', component: PaymentComponent },
      { path: 'search', component: SearchComponent },
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
