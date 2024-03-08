import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { User } from "../model/user-detail";

@Injectable({
    providedIn: "root"
})

export class FollowService{

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

    getAllFollowersById(userId: string | null | undefined): Observable<User[]> {
        return this.http.get<User[]>(`${environment.followUrl}/followers/${userId}`).pipe(
            catchError(err => {
                if (!err.error || !err.error.error) {
                    return throwError(() => 'An unknown error has occurred');
                }
                switch (err.error.error.message) {
                    default:
                        this.error = err.error.error.message;
                }
                return throwError(() => this.error);
            }));
    }

    getAllFollowingById(userId: string | null | undefined): Observable<User[]> {
        return this.http.get<User[]>(`${environment.followUrl}/following/${userId}`).pipe(
            catchError(err => {
                if (!err.error || !err.error.error) {
                    return throwError(() => 'An unknown error has occurred');
                }
                switch (err.error.error.message) {
                    default:
                        this.error = err.error.error.message;
                }
                return throwError(() => this.error);
            }));
    }
}