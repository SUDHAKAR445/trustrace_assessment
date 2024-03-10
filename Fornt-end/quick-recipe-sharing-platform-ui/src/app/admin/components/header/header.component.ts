import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  alertService: AlertService = inject(AlertService);
  subscription!: Subscription;
  
  userId!: string | undefined | null;
  userDetail!: User | null;

  ngOnInit() {
    this.subscription = this.authService.userDetail.subscribe((data) => {
      this.userDetail = data;
    });
  }
  onLogoutClicked(){
    this.alertService.confirm('Confirm', 'Are going to logout?').then((isConfirmed) => {
      if (isConfirmed) {
        this.authService.logout();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
