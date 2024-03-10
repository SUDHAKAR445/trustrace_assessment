import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { AlertService } from 'src/app/services/alert.service';
import { CuisineService } from 'src/app/services/cuisine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuisine-create',
  templateUrl: './cuisine-create.component.html',
  styleUrls: ['./cuisine-create.component.scss']
})
export class CuisineCreateComponent implements IDeactivateComponent, OnInit {

  cuisineService: CuisineService = inject(CuisineService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  createCuisineForm!: FormGroup;
  isSubmitted: boolean = false;

  ngOnInit() {
    this.createCuisineForm = new FormGroup({
      name: new FormControl(null, [Validators.required] as ValidatorFn[]),
    });
  }

  onCreateCuisineFormSubmitted() {
    this.alertService.confirm('Confirm', 'Are you create this cuisine?').then((isConfirmed) => {
      if (isConfirmed) {
        this.isSubmitted = true;
        this.cuisineService.createCuisine(this.createCuisineForm.value).subscribe({
          next: (response) => {
            this.alertService.showSuccess("Cuisine created Successfully");
            this.router.navigate(['/admin/cuisines']);
          },
          error: (error) => {
            this.alertService.showError("Error in creating the Cuisine");
            this.router.navigate(['/admin/cuisines']);
          }
        })
      }
    });
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.createCuisineForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
