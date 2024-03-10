import { AbstractControl, FormControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { UserService } from "../services/user.service";
import { Injectable } from "@angular/core";
import { debounceTime, switchMap, map } from "rxjs/operators";
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
                map(isTaken => (isTaken ? { checkValue: true } : null))
            );
        };
    }

    private usernameAllowed(value: any): Observable<boolean> {
        return this.userService.checkUsername(value).pipe(
            debounceTime(300),
            switchMap(isTaken => of(isTaken))
        );
    }

    checkEmail(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.emailAllowed(control.value).pipe(
                map(isTaken => (isTaken ? { checkEmail: true } : null))
            );
        };
    }

    private emailAllowed(value: any): Observable<boolean> {
        return this.userService.checkEmail(value).pipe(
            debounceTime(300),
            switchMap(isTaken => of(isTaken))
        );
    }
}

