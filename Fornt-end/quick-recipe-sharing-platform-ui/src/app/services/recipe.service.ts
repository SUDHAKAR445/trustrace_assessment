import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Recipe } from "../model/recipe.model";
import { Comment } from "../model/comment.model";


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Injectable({
    providedIn: 'root'
})

export class RecipeService {

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

    recipeComments: BehaviorSubject<Comment[] | null> = new BehaviorSubject<Comment[] | null>(null);

    getAllRecipe(pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(environment.recipeUrl, { params: queryParams }).pipe(
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

    getRecipeById(id: string | null): Observable<Recipe> {
        return this.http.get<Recipe>(`${environment.recipeUrl}/${id}`).pipe(
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

    getAllRecipeByUserId(id: string | null, pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);
        return this.http.get<any>(`${environment.recipeUrl}/user/${id}`, { params: queryParams }).pipe(
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

    deleteRecipeById(id: string | null | undefined): Observable<void> {
        return this.http.delete<void>(`${environment.recipeUrl}/${id}`).pipe(
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

    updateRecipeById(id: string | null, values: FormData): Observable<void> {
        return this.http.put<void>(`${environment.recipeUrl}/update/${id}`, values).pipe(
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

    getAllRecipeBySearch(
        inputValue: string | null,
        selectedCuisine: string | null,
        selectedCategory: string | null,
        start: Date | null | undefined,
        end: Date | null | undefined,
        pageIndex: number,
        pageSize: number
    ): Observable<any> {
        let queryParams = new HttpParams()
            .append('searchText', inputValue || '')
            .append('cuisineName', selectedCuisine || '')
            .append('categoryName', selectedCategory || '')
            .append('startDate', start?.toDateString() || new Date(year - 1, month, day).toDateString())
            .append('endDate', end?.toDateString() || new Date(year, month, day).toDateString())
            .append('page', pageIndex.toString())
            .append('size', pageSize.toString());
        return this.http.get<any>(`${environment.recipeUrl}/search`, { params: queryParams }).pipe(
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

    createRecipe(id: string | null | undefined, formData: any): Observable<any> {

        return this.http.post<string>(`${environment.recipeUrl}/create/${id}`, formData).pipe(
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

    updateRecipeImage(id: string, imageFile: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);
        return this.http.put<string>(`${environment.recipeUrl}/update/image/${id}`, formData).pipe(
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

    createComment(recipeId: string | null, userId: string | undefined | null, commentText: string | null): Observable<Comment> {
        return this.http.post<Comment>(`${environment.recipeUrl}/comment/${recipeId}/${userId}`, {text: commentText}).pipe(
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

    saveRecipeInUserCollection(userId: string | undefined | null, recipeId: string | undefined) : Observable<void>{
        return this.http.put<void>(`${environment.recipeUrl}/save/${userId}/${recipeId}`, {}).pipe(
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

    
    removeRecipeInUserCollection(userId: string | undefined | null, recipeId: string | undefined) : Observable<void>{
        return this.http.put<void>(`${environment.recipeUrl}/remove/${userId}/${recipeId}`, {}).pipe(
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

    getAllSavedRecipeByUserId(id: string | undefined | null): Observable<any[]> {

        return this.http.get<any[]>(`${environment.recipeUrl}/saved/${id}`).pipe(
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

    likeRecipe(recipeId: string, userId: string | undefined | null): Observable<void> {
        return this.http.put<void>(`${environment.recipeUrl}/like/${recipeId}/${userId}`, {}).pipe(
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

    unlikeRecipe(recipeId: string, userId: string | undefined | null): Observable<void> {
        return this.http.put<void>(`${environment.recipeUrl}/unlike/${recipeId}/${userId}`, {}).pipe(
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

    getAllLikedRecipes(userId: string | null | undefined): Observable<string[]> {

        return this.http.get<string[]>(`${environment.recipeUrl}/user-liked/${userId}`).pipe(
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