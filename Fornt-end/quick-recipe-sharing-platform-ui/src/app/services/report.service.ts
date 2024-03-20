import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Report } from "../model/report.model";

@Injectable({
    providedIn: 'root'
})

export class ReportService {

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

    getAllReportedRecipe(pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.reportUrl}/recipe`, { params: queryParams }).pipe(
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

    getAllReportedComment(pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.reportUrl}/comment`, { params: queryParams }).pipe(
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

    getAllReportedUser(pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.reportUrl}/user`, { params: queryParams }).pipe(
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

    getReportById(id: string | null): Observable<Report> {
        return this.http.get<Report>(`${environment.reportUrl}/${id}`).pipe(
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

    deleteReportById(id: string): Observable<string> {
        return this.http.delete<string>(`${environment.reportUrl}/${id}`).pipe(
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

    updateReportStatusById(reportId: string | undefined, status: string): Observable<void> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("status", status);

        return this.http.put<void>(`${environment.reportUrl}/${reportId}`, status).pipe(
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

    getAllReportedCommentStatus(
        inputValue: string,
        status: string,
        start: Date | null | undefined,
        end: Date | null | undefined,
        pageIndex: number,
        pageSize: number) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("searchText", inputValue || '');
        queryParams = queryParams.append("status", status || '');
        queryParams = queryParams.append("start", start?.toDateString() || '');
        queryParams = queryParams.append("end", end?.toDateString() || '');
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.reportUrl}/comment/status`, { params: queryParams }).pipe(
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

    getAllReportedUserStatus(
        inputValue: string,
        status: string,
        start: Date | null | undefined,
        end: Date | null | undefined,
        pageIndex: number,
        pageSize: number) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("searchText", inputValue || '');
        queryParams = queryParams.append("status", status || '');
        queryParams = queryParams.append("start", start?.toDateString() || '');
        queryParams = queryParams.append("end", end?.toDateString() || '');
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.reportUrl}/user/status`, { params: queryParams }).pipe(
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


    getAllReportedRecipeStatus(
        inputValue: string,
        status: string,
        start: Date | null | undefined,
        end: Date | null | undefined,
        pageIndex: number,
        pageSize: number) {
        let queryParams = new HttpParams();
        queryParams = queryParams.append("searchText", inputValue || '');
        queryParams = queryParams.append("status", status || '');
        queryParams = queryParams.append("start", start?.toDateString() || '');
        queryParams = queryParams.append("end", end?.toDateString() || '');
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.reportUrl}/recipe/status`, { params: queryParams }).pipe(
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