import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { FileHandle } from 'src/app/model/file-handle.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements IDeactivateComponent {

  userService: UserService = inject(UserService);
  alertService: AlertService = inject(AlertService);
  customValidators: CustomValidators = inject(CustomValidators);
  router: Router = inject(Router);

  createUserForm!: FormGroup;
  imageFile!: FileHandle;
  isSubmitted: boolean = false;

  ngOnInit() {
    this.createUserForm = new FormGroup({
      usernameValue: new FormControl(null, {
        validators: [Validators.required, this.customValidators.noSpaceAllowed],
        asyncValidators: [this.customValidators.checkUsername()],
        updateOn: 'blur'
      }),
      firstName: new FormControl(null, [Validators.required, this.customValidators.noSpaceAllowed]),
      lastName: new FormControl(null, [Validators.required, this.customValidators.noSpaceAllowed]),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email, this.customValidators.noSpaceAllowed],
        asyncValidators: [this.customValidators.checkEmail()],
        updateOn: 'blur'
      }),
      gender: new FormControl(null, Validators.required),
      contact: new FormControl(null),
      role: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)]),
    });
  }

  onCreateFormSubmitted() {
    this.alertService.confirm("Confirm", "Are you sure you want to create this user?").then((confirmed) => {
      if (confirmed) {
        this.isSubmitted = true;
        this.userService.createUser(this.createUserForm.value).subscribe({
          next: (response) => {
            this.alertService.showSuccess("User created successfully");
            this.router.navigate(['/admin/users']);
          },
          error: (error) => {
            this.alertService.showError("Error in creating the user");
            this.router.navigate(['/admin/users']);
          }
        })
      }
    });
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.createUserForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}