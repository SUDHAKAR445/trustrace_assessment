import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { Observable, map, take } from "rxjs";
import { Token } from "../model/user";
import { IDeactivateComponent } from "../model/canActivate.model";

export const canActivate = (
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {

    const authService: AuthService = inject(AuthService);
    const route: Router = inject(Router);

    return authService.user.pipe(take(1), map((user: Token | null) => {
        const loggedIn: boolean = user ? true : false;

        if (loggedIn && router.data["requiredRole"].indexOf(user?.authority) !== -1) {
            return true;
        } else {
            return route.createUrlTree(['/login']);
        }
    }))
}

export const hasOtpVerified = (
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {

    const authService: AuthService = inject(AuthService);
    const route: Router = inject(Router);

    const isOtpVerified = authService.getOtpVerificationStatus();
    const isPasswordChanged = authService.getPasswordChangedStatus();

    if (isOtpVerified) {
        return true;
    } else {
        return route.createUrlTree(['/login']);
        return false;
    }
}
