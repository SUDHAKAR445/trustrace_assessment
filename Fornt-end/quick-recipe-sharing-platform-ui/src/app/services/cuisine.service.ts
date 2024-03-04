import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Cuisine } from "../model/cuisine.model";
import { RecipeCuisine } from "../model/recipe-cuisine.model";

@Injectable({
    providedIn: "root"
})

export class CuisineService {

    http: HttpClient = inject(HttpClient);
    error: string | null = null;

    getAllCuisineList(pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(environment.cuisineUrl, { params: queryParams }).pipe(
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

    createCuisine(cuisine: Cuisine): Observable<string> {

        return this.http.post<string>(environment.cuisineUrl, cuisine.name).pipe(
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

    getCuisineDetailsById(id: string | null): Observable<Cuisine> {

        return this.http.get<Cuisine>(`${environment.cuisineUrl}/${id}`).pipe(
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

    getRecipeByCuisine(id: string | null, pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);

        return this.http.get<any>(`${environment.cuisineUrl}/getRecipes/${id}`, { params: queryParams }).pipe(
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

    searchCuisine(searchText: string, pageIndex: number, pageSize: number): Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.append("searchText", searchText);
        queryParams = queryParams.append("page", pageIndex);
        queryParams = queryParams.append("size", pageSize);
        return this.http.get<any>(`${environment.cuisineUrl}/search`, { params: queryParams}).pipe(
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