import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'quick-recipe-sharing-platform-ui';

  authService: AuthService = inject(AuthService);

  ngOnInit(){
    this.authService.autoLogin();
  }
}
