import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Payment, Transaction } from '../model/payment.model';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  http: HttpClient = inject(HttpClient);
  error: string | null = null;

  createTransaction(data: Payment): Observable<any> {
    return this.http.post('http://localhost:8080/api/payment/charge', data).pipe(
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

  updateTransaction(id: string, paymentId: string): Observable<void> {

    let queryParams = new HttpParams();
    queryParams = queryParams.append("paymentId", paymentId);

    return this.http.put<void>(`${environment.paymentUrl}/${id}`, paymentId).pipe(
      catchError(err => {
        if (!err.error || !err.error.error) {
          return throwError(() => 'An unknown error has occurred');
        }
        switch (err.error.error.message) {
          default:
            this.error = err.error.error.message;
        }
        return throwError(() => this.error);
      }));;
  }

  getAllTransactions(pageIndex: number, pageSize: number): Observable<any> {

    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', pageIndex);
    queryParams = queryParams.append('size', pageSize);

    return this.http.get<any>(environment.paymentUrl, {params: queryParams}).pipe(
      catchError(err => {
        if (!err.error || !err.error.error) {
          return throwError(() => 'An unknown error has occurred');
        }
        switch (err.error.error.message) {
          default:
            this.error = err.error.error.message;
        }
        return throwError(() => this.error);
      }));;
  }

  getTransactionById(id: string | null) : Observable<Transaction>{
    return this.http.get<Transaction>(`${environment.paymentUrl}/${id}`).pipe(
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

  searchTransaction(inputValue: string, status: string, startDate: Date | null | undefined, endDate: Date | null | undefined, pageIndex: number, pageSize: number): Observable<any> {
    let queryParam = new HttpParams();
    queryParam = queryParam.append("searchText", inputValue || '');
    queryParam = queryParam.append("status", status || '');
    queryParam = queryParam.append("startDate", startDate?.toDateString() || '');
    queryParam = queryParam.append("endDate", endDate?.toDateString() || '');
    queryParam = queryParam.append("page", pageIndex);
    queryParam = queryParam.append("size", pageSize);

    return this.http.get<any>(`${environment.paymentUrl}/search`, { params: queryParam}).pipe(
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

  getTransactionByUserId(id: string | null | undefined, pageIndex: number, pageSize: number) : Observable<any>{

    let queryParams = new HttpParams()
        .append('page', pageIndex)
        .append('size', pageSize);

    return this.http.get<Transaction>(`${environment.paymentUrl}/user/${id}`, { params: queryParams}).pipe(
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
