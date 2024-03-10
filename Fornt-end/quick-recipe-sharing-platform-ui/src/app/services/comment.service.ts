import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Comment } from "../model/comment.model";

@Injectable({
    providedIn: 'root'
})

export class CommentService {

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

    getAllComments(id: string | null, pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.commentUrl}/${id}`, { params: queryParams }).pipe(
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

    getCommentById(id: string | null): Observable<Comment> {
        return this.http.get<Comment>(`${environment.commentUrl}/id/${id}`).pipe(
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

    deleteCommentById(commentId: string | undefined): Observable<void> {
        return this.http.delete<void>(`${environment.commentUrl}/delete/${commentId}`).pipe(
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

    reportComment(reporterId: string | null | undefined, reportedId: string | undefined, text: string): Observable<void> {
        return this.http.post<void>(`${environment.reportUrl}/comment/${reporterId}`, {reportedId: reportedId, text: text}).pipe(
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

    reportRecipe(reporterId: string | null | undefined, reportedId: string | undefined, text: string): Observable<void> {
        return this.http.post<void>(`${environment.reportUrl}/recipe/${reporterId}`, {reportedId: reportedId, text: text}).pipe(
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

    reportUser(reporterId: string | null | undefined, reportedId: string | undefined, text: string): Observable<void> {
        return this.http.post<void>(`${environment.reportUrl}/user/${reporterId}`, {reportedId: reportedId, text: text}).pipe(
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

    getAllLikedCommentsByUser(userId: string | undefined | null): Observable<string[]> {
        return this.http.get<string[]>(`${environment.commentUrl}/like/${userId}`).pipe(
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

    likeComment(commentId: string, userId: string | null | undefined): Observable<void>{
        return this.http.put<void>(`${environment.commentUrl}/like/${commentId}/${userId}`, {}).pipe(
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

    unlikeComment(commentId: string, userId: string | null | undefined): Observable<void>{
        return this.http.put<void>(`${environment.commentUrl}/unlike/${commentId}/${userId}`, {}).pipe(
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