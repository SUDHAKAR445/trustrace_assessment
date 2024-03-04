import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FileHandle } from 'src/app/model/file-handle.model';
import { User } from 'src/app/model/user-detail';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  updateUserForm!: FormGroup;
  imageFile!: FileHandle;
  errorMessage: string | null = null;

  defaultImageUrl = "https://img.icons8.com/bubbles/100/000000/user.png";

  userId: string | null = null;
  userDetail: User = {} as User;
  imagePreview: SafeUrl | null = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.updateUserForm = new FormGroup({
      usernameValue: new FormControl(null, [Validators.required]),
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

            // Initialize default image URL
            this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  onUpdateFormSubmitted() {
    if (this.updateUserForm.valid) {
      const userFormData = this.prepareFormData(this.updateUserForm.value);
      this.userService.updateUserById(this.userId!, userFormData).subscribe({
        next: (response) => {
          this.router.navigate(['/moderator/profile']);
        },
        error: (error) => {
          this.errorMessage = error;
          this.router.navigate(['/moderator/profile']);
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      });
    }
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
}
