import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{

  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  recipeService: RecipeService = inject(RecipeService);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);
  userDetailSubscription!: Subscription;

  userId!: string | undefined | null;
  userDetail!: User | null;
  isMenuOpen: boolean = false;

  ngOnInit() {
    this.userDetailSubscription = this.authService.userDetail.subscribe((data) => {
      this.userDetail = data;
    });
  }
  onLogoutClicked(){
    this.alertService.confirm('Confirm', 'Are going to logout?').then((isConfirmed) => {
      if (isConfirmed) {
        this.router.navigate(['/login']);
        this.authService.logout();
      }
    });
  }

  onSearchClicked(search: string) {
    this.router.navigate(['/user/search'], { queryParams: { 'search': search } });
  }

  ngOnDestroy() {
    this.userDetailSubscription.unsubscribe();
  }

  onSearchChange(searchText: string): void {
    this.recipeService.setSearchText(searchText);
  }
}
