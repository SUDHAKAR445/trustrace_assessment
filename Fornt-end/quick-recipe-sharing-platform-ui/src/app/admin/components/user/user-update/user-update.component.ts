import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { FileHandle } from 'src/app/model/file-handle.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements IDeactivateComponent {

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  alertService: AlertService = inject(AlertService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  customValidators: CustomValidators = inject(CustomValidators);

  updateUserForm!: FormGroup;
  imageFile!: FileHandle;
  userId!: string | null;
  userDetail!: User;
  isSubmitted: boolean = false;

  ngOnInit() {
    this.updateUserForm = new FormGroup({
      usernameValue: new FormControl(null, [Validators.required, this.customValidators.checkUsername]),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      contact: new FormControl(null),
      role: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });

    this.activeRoute.queryParamMap.subscribe((data) => {
      this.userId = data.get('detail');
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe({
          next: (response) => {
            this.userDetail = response;
            this.updateUserForm.setValue({
              usernameValue: this.userDetail.usernameValue,
              firstName: this.userDetail.firstName,
              lastName: this.userDetail.lastName,
              email: this.userDetail.email,
              gender: this.userDetail.gender,
              contact: this.userDetail.contact,
              role: this.userDetail.role,
              password: this.userDetail.password || null,
            });
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }


  onUpdateFormSubmitted() {
    this.alertService.confirm('Confirm', 'Are you sure you update this changes?').then((isConfirmed) => {
      if (isConfirmed) {
        this.isSubmitted = true;
        if (this.updateUserForm.valid) {
          const userFormData = this.prepareFormData(this.updateUserForm.value);
          this.userService.updateUserById(this.userId, userFormData).subscribe({
            next: (response) => {
              this.alertService.showSuccess('User updated successfully');
              this.router.navigate(['/admin/users']);
            },
            error: (error) => {
              this.alertService.showError('Error occurred in updating the user (Reason username or email already exists)');
              this.router.navigate(['/admin/users']);
            }
          });
        }
      }
    });
  }

  prepareFormData(user: User): FormData {
    const formData = new FormData();

    formData.append('usernameValue', user.usernameValue || '');
    formData.append('firstName', user.firstName || '');
    formData.append('lastName', user.lastName || '');
    formData.append('email', user.email || '');
    formData.append('gender', user.gender || '');
    formData.append('contact', user.contact || '');
    formData.append('role', user.role || '');
    formData.append('password', user.password || '');


    if (this.imageFile) {
      formData.append('imageFile', this.imageFile.file);
    }

    return formData;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const fileHandle: FileHandle = {
        file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      }
      this.imageFile = fileHandle;
    }
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.updateUserForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }

  onCancelClicked() {
    window.history.go(-1);
  }
}