import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { User } from "../model/user-detail";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: "root"
})

export class UserService {

    error: string | null = null;
    http: HttpClient = inject(HttpClient);

    // createUser() {
    //     return this.http.post<User>()
    // }


    getAllUsers(pageIndex: number, pageSize: number) {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(environment.userUrl, { params: queryParams }).pipe(
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

    checkUsername(username: String) {
        return this.http.get<boolean>(`${environment.userUrl}/check/username/${username}`);
    }

    checkEmail(email: String) {
        return this.http.get<boolean>(`${environment.userUrl}/check/email/${email}`);
    }

    createUser(user: User): Observable<String> {
        return this.http.post<string>(environment.userUrl, user).pipe(
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

    getUserById(id: string | null | undefined): Observable<User> {
        return this.http.get<User>(`${environment.userUrl}/${id}`).pipe(
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

    deleteUserById(id: string): Observable<string> {
        return this.http.delete<string>(`${environment.userUrl}/${id}`).pipe(
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

    updateUserById(id: string | null , formData: FormData): Observable<string> {
        return this.http.put<string>(`${environment.userUrl}/${id}`, formData).pipe(
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

    searchUsers(searchText: string, selectedRole: string, selectedGender: string, pageIndex: number, pageSize: number): Observable<any>{

        let queryParams = new HttpParams();
        queryParams = queryParams.append("searchText", searchText);
        queryParams = queryParams.append("selectedRole", selectedRole);
        queryParams = queryParams.append("selectedGender", selectedGender);
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);
        return this.http.get<any>(`${environment.userUrl}/search`, { params: queryParams}).pipe(
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