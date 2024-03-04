import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: 'root',
})

export class DashboardService {

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

    getAdminDashboardContent(): Observable<{ key: string, value: { [key: string]: number } }[]> {
        return this.http.get<{ [key: string]: number }[]>(`${environment.dashboardUrl}/admin`).pipe(
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
            map(data => {
                return Object.entries(data).map(([key, value]) => ({ key, value }));
            })
        );
    }

    getModeratorDashboardContent(): Observable<{ key: string, value: { [key: string]: number } }[]> {
        return this.http.get<{ [key: string]: number }[]>(`${environment.dashboardUrl}/moderator`).pipe(
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
            map(data => {
                return Object.entries(data).map(([key, value]) => ({ key, value }));
            })
        );
    }
}