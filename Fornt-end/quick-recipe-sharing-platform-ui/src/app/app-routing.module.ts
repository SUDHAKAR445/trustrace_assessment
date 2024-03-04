import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './authentication/components/not-found/not-found.component';
import { canActivate } from './routeGuards/authGuard.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'admin',
    canActivate: [canActivate],
    data: { requiredRole: 'ROLE_ADMIN'},
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: 'moderator',
    canActivate: [canActivate],
    data: { requiredRole: 'ROLE_MODERATOR'},
    loadChildren: () => import('./moderator/moderator.module').then((m) => m.ModeratorModule)
  },
  {
    path: 'user',
    canActivate: [canActivate],
    data: { requiredRole: 'ROLE_USER'},
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
