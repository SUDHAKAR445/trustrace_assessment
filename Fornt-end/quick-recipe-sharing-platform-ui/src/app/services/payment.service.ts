import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  public createTransaction(amount: number) {
    return this.http.post('http://localhost:8080/api/payment/charge', amount);
  }
}
