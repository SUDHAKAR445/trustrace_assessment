import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent {

  createCategoryForm!: FormGroup;
  errorMessage!: string | null

  categoryService: CategoryService = inject(CategoryService);
  router: Router = inject(Router);
  // sanitizer: DomSanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.createCategoryForm = new FormGroup({
      name: new FormControl(null, [Validators.required] as ValidatorFn[]),
    });
  }


  onCreateCategoryFormSubmitted() {
    this.categoryService.createCategory(this.createCategoryForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/categories']);
      },
      error: (error) => {
        this.errorMessage = error;
        this.router.navigate(['/admin/categories']);
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }
}
