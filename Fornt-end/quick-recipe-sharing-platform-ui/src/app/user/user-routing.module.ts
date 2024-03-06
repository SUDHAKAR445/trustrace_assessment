import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FeedPageComponent } from './components/feed-page/feed-page.component';
import { RecipeCreateComponent } from './components/recipe/recipe-create/recipe-create.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookingsDetailComponent } from './components/bookings-detail/bookings-detail.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedPageComponent },
      { path: 'create', component: RecipeCreateComponent },
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
