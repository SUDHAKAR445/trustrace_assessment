import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { FileHandle } from 'src/app/model/file-handle.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, IDeactivateComponent {

  alertService: AlertService = inject(AlertService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  authService: AuthService = inject(AuthService);
  customValidator: CustomValidators = inject(CustomValidators);

  updateUserForm!: FormGroup;
  imageFile!: FileHandle;
  defaultImageUrl!: string;
  isSubmitted: boolean = false;
  userId: string | null = null;
  userDetail: User | null = {} as User;
  imagePreview: SafeUrl | null = null;

  ngOnInit(): void {
    this.updateUserForm = new FormGroup({
      usernameValue: new FormControl({disabled: true}, [Validators.required]),
      firstName: new FormControl(null, [Validators.required, this.customValidator.noSpaceAllowed]),
      lastName: new FormControl(null, [Validators.required, this.customValidator.noSpaceAllowed]),
      email: new FormControl({disabled: true}, Validators.required),
      gender: new FormControl(null, Validators.required),
      contact: new FormControl(null, Validators.min(1000)),
      role: new FormControl(null),
      password: new FormControl(null),
    });

    this.authService.userDetail.subscribe((data) => {
      this.userDetail = data;
      this.updateUserForm.setValue({
        usernameValue: this.userDetail?.usernameValue,
        firstName: this.userDetail?.firstName,
        lastName: this.userDetail?.lastName,
        email: this.userDetail?.email,
        gender: this.userDetail?.gender,
        contact: this.userDetail?.contact,
        role: this.userDetail?.role,
        password: this.userDetail?.password || null,
      });

      this.defaultImageUrl = this.userDetail?.profileImageUrl!;
      // Initialize default image URL
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl);

    });
  }
  onUpdateFormSubmitted() {
    this.alertService.confirm("Confirm", "Are you sure you want to update yuor profile?").then((confirmed) => {
      if (confirmed) {
        this.isSubmitted = true;
        if (this.updateUserForm.valid) {
          const userFormData = this.prepareFormData(this.updateUserForm.value);
          this.userService.updateUserById(this.userDetail?.id!, userFormData).subscribe({
            next: (response) => {
              this.userService.getUserById(this.userDetail?.id).subscribe((data) => {
                this.authService.userDetail.next(data);
              });
              this.userService.getUserById(this.userId).subscribe((data) => {
                this.authService.userDetail.next(data);
              });
              
              this.alertService.showSuccess("Your profile updated successfully");
              this.router.navigate(['/moderator/profile']);
            },
            error: (error) => {
              this.alertService.showError("Error in updating your profile");
              this.router.navigate(['/moderator/profile']);
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
      };
      this.imageFile = fileHandle;
      this.imagePreview = fileHandle.url;
    }
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.updateUserForm.dirty && !this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}
