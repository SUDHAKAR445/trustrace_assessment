import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';

declare let Razorpay: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(private paymentService: PaymentService) { }

  paymentForm!: FormGroup;

  bookingAmount: number = 100;

  ngOnInit() {
    this.paymentForm = new FormGroup({
      bookerId: new FormControl(null, Validators.required),
      recipeId: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required)
    });
  }

  bookNowClicked() {
    this.paymentService.createTransaction(this.paymentForm.value).subscribe({
      next: response => {
        console.log(response);
        this.openTransactionModel(response);
      },
      error: response => {
        console.log(response);
      }
    });
  }

  openTransactionModel(response: any) {
    const res = response;
    const options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: response.companyName,
      description: 'Payment for Recipe Booking',
      image: 'https://img.freepik.com/free-vector/mobile-bank-users-transferring-money-currency-conversion-tiny-people-online-payment-cartoon-illustration_74855-14454.jpg',
      prefill: {
        name: response.bookerName,
        email: response.bookerEmail,
        contact: response.bookerContact
      },
      handler: (response: any) => {
        if (response != null && response.razorpay_payment_id != null) {
          this.paymentService.updateTransaction(res.id, response.razorpay_payment_id).subscribe({
            next: (response) => console.log(response),
            error: (err) => console.log(err),
          });
        }
        else
          this.paymentService.updateTransaction(res.id, '').subscribe({
            next: (response) => console.log(response),
            error: (err) => console.log(err),
          });
      },
      notes: {
        address: 'Book the person and Cook your food'
      },
      theme: {
        color: '#0c238a'
      },
      modal: {
        ondismiss: () => {
          this.paymentService.updateTransaction(res.id, '').subscribe({
            next: (response) => console.log(response),
            error: (err) => {
              console.log(err);
              alert('Payment failed..');
            },
          });
        }
      }
    };

    let razorpayObject: any = new Razorpay(options);
    razorpayObject.open();

  }
}

