import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { User } from "../model/user-detail";

@Injectable({
    providedIn: "root",
})

export class BlockService {
    http: HttpClient = inject(HttpClient);
    error!: string | null;

    blockUser(blockerUserId: string, blockedUserId: string): Observable<void> {
        return this.http.post<void>(`${environment.blockUrl}/${blockerUserId}/${blockedUserId}`, {}).pipe(
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

    unblockUser(blockerUserId: string, blockedUserId: string): Observable<void> {
        return this.http.delete<void>(`${environment.blockUrl}/${blockerUserId}/${blockedUserId}`).pipe(
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

    getAllBlockedUser(userId: string): Observable<User[]> {
        return this.http.get<User[]>(`${environment.blockUrl}/${userId}`).pipe(
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