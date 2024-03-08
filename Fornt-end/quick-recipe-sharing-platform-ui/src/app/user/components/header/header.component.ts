import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user-detail';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);

  userId!: string | undefined | null;
  userDetail!: User;

  ngOnInit() {
    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
    })

    this.userService.getUserById(this.userId).subscribe((data) => {
      this.userDetail = data;
    })
  }
  onLogoutClicked(){
    this.authService.logout();
  }

  onSearchClicked(search: string) {
    this.router.navigate(['/user/search'], { queryParams: { 'search': search } });
  }
}
