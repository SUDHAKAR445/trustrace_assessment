import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment.development";
import { Token } from "../model/user";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    user: BehaviorSubject<Token | null> = new BehaviorSubject<Token | null>(null);
    user
    error: string | null = null;

    private tokenExpireTimer: ReturnType<typeof setTimeout> | null = null;

    private isOtpVerified = false;
    private isPasswordChanged = false;

    getOtpVerificationStatus(): boolean {
        return this.isOtpVerified;
    }

    setOtpVerificationStatus(status: boolean): void {
        this.isOtpVerified = status;
    }

    getPasswordChangedStatus(): boolean {
        return this.isPasswordChanged;
    }

    setPasswordChangedStatus(status: boolean): void {
        this.isPasswordChanged = status;
    }

    register(username: string, firstName: string, lastName: string, email: string, gender: string, password: string): Observable<string> {
        const data = {
            userName: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            password: password
        };
        return this.http.post<string>(environment.registerUrl, data).pipe(
            catchError(err => {
                if (!err.error || !err.error.error) {
                    return throwError(() => 'An unknown error has occurred');
                }
                switch (err.error.error.message) {
                    default:
                        this.error = err.error.error.message;
                }
                return throwError(() => this.error);
            })
        );
    }

    login(usernameOrEmail: string, password: string): Observable<string> {
        const data = {
            usernameOrEmail: usernameOrEmail,
            password: password
        };
        return this.http.post<string>(environment.loginUrl, data).pipe(
            catchError(err => {
                if (!err.error || !err.error.error) {
                    return throwError(() => 'An unknown error has occurred');
                }
                switch (err.error.error.message) {
                    default:
                        this.error = err.error.error.message;
                }
                return throwError(() => this.error);
            }),
            tap((res: any) => this.handleAuthentication(res))
        );
    }

    private handleAuthentication(res: any) {
        const decodeToken = this.getDecodedAccessToken(res.token);
        const user = new Token(decodeToken?.sub, res?.token, decodeToken?.exp * 1000, decodeToken?.Authorities[0]?.authority);
        this.user.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.autoLogout(user.expiresIn);
    }

    getDecodedAccessToken(token: string): any {
        try {
            return this.jwtHelper.decodeToken(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    autoLogin() {
        const storedUserString: string | null = localStorage.getItem('user');

        if (!storedUserString) {
            return;
        }
        const user = JSON.parse(storedUserString);
        if (!user) {
            return;
        }

        const currentTime = new Date().getTime();
        const timeDifference = user._expiresIn - currentTime;

        if (timeDifference > 0) {
            const loggedUser = new Token(user.id, user._token, user._expiresIn, user._authority);
            if (loggedUser.token) {
                this.user.next(loggedUser);
                this.autoLogout(timeDifference);
            }
        } else {
            this.logout();
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.clear();
        this.clearTokenExpireTimer();
    }

    autoLogout(expireTime: number) {
        this.clearTokenExpireTimer();
        this.tokenExpireTimer = setTimeout(() => {
            this.logout();
        }, expireTime);
    }

    private clearTokenExpireTimer() {
        if (this.tokenExpireTimer) {
            clearTimeout(this.tokenExpireTimer);
            this.tokenExpireTimer = null;
        }
    }

    verifyEmail(email: string): Observable<void> {
        return this.http.post<void>(`${environment.forgotUrl}/verify/${email}`, {});
    }

    verifyOtp(otp: number, email: string): Observable<void> {
        return this.http.get<void>(`${environment.forgotUrl}/verify-otp/${otp}/${email}`, {});
    }

    changePassword(email: string, password: string): Observable<void> {
        return this.http.put<void>(`${environment.forgotUrl}/change-password/${email}`, password);
    }

    confirmAccount(token: string | null): Observable<void> {
        return this.http.post<void>(`${environment.verifyUrl}`, token).pipe(
            catchError(err => {
                if (!err.error || !err.error.error) {
                    return throwError(() => 'An unknown error has occurred');
                }
                switch (err.error.error.message) {
                    default:
                        this.error = err.error.error.message;
                }
                return throwError(() => this.error);
            })
    )};
}
