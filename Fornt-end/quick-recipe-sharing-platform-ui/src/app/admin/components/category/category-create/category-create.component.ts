import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements IDeactivateComponent {

  createCategoryForm!: FormGroup;
  isSubmitted: boolean = false;

  categoryService: CategoryService = inject(CategoryService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  ngOnInit() {
    this.createCategoryForm = new FormGroup({
      name: new FormControl(null, [Validators.required] as ValidatorFn[]),
    });
  }

  onCreateCategoryFormSubmitted() {

    this.alertService.confirm('Confirm', 'Are you create this category?').then((isConfirmed) => {
      if (isConfirmed) {
        this.isSubmitted = true;
        this.categoryService.createCategory(this.createCategoryForm.value).subscribe({
          next: (response) => {
            this.alertService.showSuccess("Category created Successfully");
            this.router.navigate(['/admin/categories']);
          },
          error: (error) => {
            this.alertService.showError("Error in creating the Category");
            this.router.navigate(['/admin/categories']);
          }
        });
      }
    });
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.createCategoryForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
