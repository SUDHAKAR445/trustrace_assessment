import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileHandle } from 'src/app/model/file-handle.model';
import { User } from 'src/app/model/user-detail';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {

  createUserForm!: FormGroup;
  imageFile!: FileHandle;
  errorMessage!: string | null

  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  // sanitizer: DomSanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.createUserForm = new FormGroup({
      usernameValue: new FormControl(null, [Validators.required] as ValidatorFn[]),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      gender: new FormControl(null),
      contact: new FormControl(null),
      role: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }


  onCreateFormSubmitted() {
    this.userService.createUser(this.createUserForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        this.errorMessage = error;
        this.router.navigate(['/admin/users']);
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }
}

// onFileSelected(event: any){
  //   if(event.target.files) {
  //     const file = event.target.files[0];

  //     const fileHandle: FileHandle = {
  //       file: file,
  //       url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
  //     }
  //     this.imageFile = file;
  //   }
  // }

  // prepareFormData(user: User): FormData {
  //   const formData = new FormData();

  //   formData.append()
  // }
