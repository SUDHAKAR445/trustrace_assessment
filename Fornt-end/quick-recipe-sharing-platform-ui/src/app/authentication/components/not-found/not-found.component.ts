import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  router: Router = inject(Router);

  ngOnInit(): void {
  }

  goBack(){
    window.history.back();
  }

  goContact(){
    this.router.navigate(['contact']);
  }
}
