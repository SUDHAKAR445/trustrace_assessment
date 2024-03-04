import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserService } from "../services/user.service";
import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CustomValidators {
    static checkUsername: ValidatorFn;
    constructor(private userService: UserService) { }

    noSpaceAllowed(control: FormControl): ValidationErrors | null {
        if (control.value != null && control.value.indexOf(' ') !== -1) {
            return { noSpaceAllowed: true };
        }
        return null;
    }

    async checkUsername(control: AbstractControl): Promise<ValidationErrors | null> {
        return await this.usernameAllowed(control.value);
    }

    private async usernameAllowed(value: any): Promise<ValidationErrors | null> {
        try {
            const isUsernameTaken = await this.userService.checkUsernameOrEmail(value).pipe(take(1)).toPromise();
            return isUsernameTaken ? { checkValue: true } : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
