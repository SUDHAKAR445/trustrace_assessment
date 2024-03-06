import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Recipe } from "../model/recipe.model";

@Injectable({
    providedIn: 'root'
})

export class RecipeService {

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

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

    deleteRecipeById(id: string | null): Observable<string> {
        return this.http.delete<string>(`${environment.recipeUrl}/${id}`).pipe(
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

    updateRecipeById(id: string | null): Observable<string> {
        return this.http.put<string>(`${environment.recipeUrl}/${id}`, {}).pipe(
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
        inputValue: any,
        selectedCuisine: string,
        selectedCategory: string,
        start: Date | null | undefined,
        end: Date | null | undefined,
        pageIndex: number,
        pageSize: number
    ): Observable<any> {
        let queryParams = new HttpParams()
            .append('searchText', inputValue)
            .append('cuisineName', selectedCuisine)
            .append('categoryName', selectedCategory)
            .append('startDate', start?.toDateString() || '')
            .append('endDate', end?.toDateString() || '')
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
}