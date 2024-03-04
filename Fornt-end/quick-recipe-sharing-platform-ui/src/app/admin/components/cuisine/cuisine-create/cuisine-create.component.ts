import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CuisineService } from 'src/app/services/cuisine.service';

@Component({
  selector: 'app-cuisine-create',
  templateUrl: './cuisine-create.component.html',
  styleUrls: ['./cuisine-create.component.scss']
})
export class CuisineCreateComponent {

  createCuisineForm!: FormGroup;
  errorMessage!: string | null

  cuisineService: CuisineService = inject(CuisineService);
  router: Router = inject(Router);
  // sanitizer: DomSanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.createCuisineForm = new FormGroup({
      name: new FormControl(null, [Validators.required] as ValidatorFn[]),
    });
  }


  onCreateCuisineFormSubmitted() {
    this.cuisineService.createCuisine(this.createCuisineForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/cuisines']);
      },
      error: (error) => {
        this.errorMessage = error;
        this.router.navigate(['/admin/cuisines']);
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }
}
