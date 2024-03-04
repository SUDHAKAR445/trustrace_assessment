import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user-detail';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent {

  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  userId!: string | null | undefined;
  userDetail!: User;


  defaultImageUrl = "https://img.icons8.com/bubbles/100/000000/user.png";
  
  ngOnInit(){
    this.authService.user.subscribe((data) => {
      this.userId = data?.userId;
    })

    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.userDetail = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  updateProfile() {
    this.router.navigate(['/admin/profile/update'], { queryParams: { detail: this.userId } })
  }
}
