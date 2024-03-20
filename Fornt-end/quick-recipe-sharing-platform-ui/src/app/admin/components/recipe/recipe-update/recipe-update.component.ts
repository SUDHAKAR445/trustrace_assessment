import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-update',
  templateUrl: './recipe-update.component.html',
  styleUrls: ['./recipe-update.component.scss']
})
export class RecipeUpdateComponent implements IDeactivateComponent, OnInit {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  recipeService: RecipeService = inject(RecipeService);
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  userId!: string | null | undefined;
  recipeId!: string | null;
  imagePreview!: string | undefined;
  isLinear: boolean = true;
  isSubmitted: boolean = false;

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;

  ngOnInit() {

    this.activeRoute.queryParamMap.subscribe((data) => {
      this.recipeId = data.get('detail');
    });

    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
    });

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
      video: new FormControl('')
    });

    this.fourthFormGroup = new FormGroup({
      servings: new FormControl(1, [Validators.required, Validators.min(1)]),
      ingredients: new FormArray([])
    });

    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (response) => {
        this.imagePreview = response.photo
        this.firstFormGroup.setValue({
          title: response.title,
          description: response.description,
          preparationTime: response.preparationTime,
          cookingTime: response.cookingTime,
          cuisine: response.cuisine.name,
          category: response.category.name,
        });

        this.secondFormGroup.setValue({
          instructions: response.instructions,
        });

        this.thirdFormGroup.setValue({
          video: response.video,
        });

        while ((this.fourthFormGroup.get('ingredients') as FormArray).length) {
          (this.fourthFormGroup.get('ingredients') as FormArray).removeAt(0);
        }

        response.ingredients.forEach(ingredient => {
          (this.fourthFormGroup.get('ingredients') as FormArray).push(
            new FormGroup({
              name: new FormControl(ingredient.name, [Validators.required]),
              quantity: new FormControl(ingredient.quantity, [Validators.required]),
              unitOfMeasurement: new FormControl(ingredient.unitOfMeasurement, [Validators.required]),
            })
          );
        });
      },
      error: (error) => {
        this.alertService.showError("Error in getting the recipe detail");
      }
    });
  }

  stepperOrientation: Observable<StepperOrientation>;

  constructor(breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(() => ('vertical')));
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

  onUpdateRecipeClicked() {
    this.alertService.confirm('Confirm', 'Are you update this changes?').then((isConfirmed) => {
      if (isConfirmed) {
        this.isSubmitted = true;
        const allFormValues = {
          ...this.firstFormGroup.value,
          ...this.secondFormGroup.value,
          ...this.thirdFormGroup.value,
          ...this.fourthFormGroup.value,
        };

        this.recipeService.updateRecipeById(this.recipeId, allFormValues).subscribe({
          next: (response) => {
            this.alertService.showSuccess("Recipe updated successfully");
            this.router.navigate(['/admin/recipes']);
          },
          error: (error) => {
            this.alertService.showError("Error occurred in updating the recipe");
            this.router.navigate(['/admin/recipes']);
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
