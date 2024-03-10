import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserService } from "../services/user.service";
import { Injectable } from "@angular/core";
import { debounceTime, switchMap, map } from "rxjs/operators";

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

    checkUsername(): ValidatorFn {
        return (control: AbstractControl) => {
            return this.usernameAllowed(control.value).pipe(
                map(isTaken => (isTaken ? { checkValue: true } : null))
            );
        };
    }

    private usernameAllowed(value: any) {
        return this.userService.checkUsernameOrEmail(value).pipe(
            debounceTime(300),
            switchMap(async (isTaken) => isTaken)
        );
    }
}
