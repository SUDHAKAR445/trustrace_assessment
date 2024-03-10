import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileHandle } from 'src/app/model/file-handle.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import Swal from 'sweetalert2';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss']
})
export class RecipeCreateComponent implements IDeactivateComponent {

  authService: AuthService = inject(AuthService);
  recipeService: RecipeService = inject(RecipeService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  selectedFile: any = null;
  imagePreview: SafeUrl | null = null;
  isLinear: boolean = true;
  userId!: string | null | undefined;
  isSubmitted: boolean = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;

  ngOnInit() {
    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
    })
    this.firstFormGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      preparationTime: new FormControl(0, Validators.required),
      cookingTime: new FormControl(0, Validators.required),
      category: new FormControl('', Validators.required),
      cuisine: new FormControl('', Validators.required)
    });

    this.secondFormGroup = new FormGroup({
      instructions: new FormControl('', Validators.required),
    });

    this.thirdFormGroup = new FormGroup({
      imageFile: new FormControl(null),
      video: new FormControl('')
    });

    this.fourthFormGroup = new FormGroup({
      servings: new FormControl(1, [Validators.required, Validators.min(1)]),
      ingredients: new FormArray([])
    });
  }

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private sanitizer: DomSanitizer) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(() => ('vertical')));
  }

  handleFileInput(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      };
      this.imagePreview = fileHandle.url;

      this.thirdFormGroup.patchValue({
        imageFile: fileHandle.file,
      });
    }
  }


  addIngredients() {
    const ingredientsFormGroup = new FormGroup({
      name: new FormControl(''),
      quantity: new FormControl(0),
      unitOfMeasurement: new FormControl(''),
    });

    (<FormArray>this.fourthFormGroup.get('ingredients')).push(ingredientsFormGroup);
  }

  getIngredients() {
    return (this.fourthFormGroup.get('ingredients') as FormArray).controls;
  }

  removeIngredient(index: number) {
    (<FormArray>this.fourthFormGroup.get('ingredients')).removeAt(index);
  }

  onPostRecipeClicked() {

    this.alertService.confirm('Confirm', 'Are you post this recipe?').then((isConfirmed) => {
      if (isConfirmed) {
        this.isSubmitted = true;
        const thirdFormGroupValue = this.thirdFormGroup.value;

        const allFormValues = {
          ...this.firstFormGroup.value,
          ...this.secondFormGroup.value,
          ...this.thirdFormGroup.value,
          ...this.fourthFormGroup.value,
        };

        this.recipeService.createRecipe(this.userId, allFormValues).subscribe({
          next: (response) => {
            this.recipeService.updateRecipeImage(response.id, thirdFormGroupValue.imageFile).subscribe({
              next: () => {
                this.alertService.showSuccess("Recipe posted successfully");
                this.router.navigate(['/moderator/feed']);
              },
              error: (error) => {
                this.alertService.showError("Error in uploading the recipe image");
                this.router.navigate(['/moderator/feed']);
              },
            });
          },
          error: (error) => {
            this.alertService.showError("Error in posting the recipe");
            this.router.navigate(['/moderator/feed']);
          },
        });
      }
    });
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if ((this.firstFormGroup.dirty || this.secondFormGroup.dirty || this.thirdFormGroup.dirty || this.fourthFormGroup.dirty) && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
