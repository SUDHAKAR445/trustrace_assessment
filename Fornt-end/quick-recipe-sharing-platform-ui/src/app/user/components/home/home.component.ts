import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  router: Router = inject(Router);
  onCreateRecipeClicked() {
    this.router.navigate(['/user/create']); 
  }
}
