import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
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

  userId!: string | undefined | null;
  userDetail!: User | null;
  subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.authService.userDetail.subscribe((data) => {
      this.userDetail = data;
    });
  }
  onLogoutClicked() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
