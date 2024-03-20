import { AbstractControl, FormControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { UserService } from "../services/user.service";
import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CustomValidators {
    constructor(private userService: UserService) { }

    noSpaceAllowed(control: FormControl): ValidationErrors | null {
        if (control.value != null && control.value.indexOf(' ') !== -1) {
            return { noSpaceAllowed: true };
        }
        return null;
    }

    checkUsername(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.usernameAllowed(control.value).pipe(
                map(isAvailable => (isAvailable ? null : { checkValue: true })),
                catchError(() => of({ checkValue: true }))
            );
        };
    }

    private usernameAllowed(username: string): Observable<boolean> {
        return this.userService.checkUsername(username);
    }

    checkEmail(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.emailAllowed(control.value).pipe(
                map(isAvailable => (isAvailable ? null : { checkEmail: true })),
                catchError(() => of({ checkEmail: true }))
            );
        };
    }

    private emailAllowed(email: string): Observable<boolean> {
        return this.userService.checkEmail(email);
    }
}
