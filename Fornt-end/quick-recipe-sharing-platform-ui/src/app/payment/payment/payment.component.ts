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
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      contact: new FormControl(null, Validators.required)
    });
  }

  bookNowClicked() {
    this.paymentService.createTransaction(this.bookingAmount).subscribe({
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
    const options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Sudhakar Senthilkumar',
      description: 'Payment of online shopping',
      image: 'https://img.freepik.com/free-vector/mobile-bank-users-transferring-money-currency-conversion-tiny-people-online-payment-cartoon-illustration_74855-14454.jpg',
      prefill: {
        name: 'SS',
        email: 'sudhakarsenthilkumar445@gmail.com',
        contact: '9751318371'
      },
      handler: (response: any) => {
        if(response != null && response.razorpay_payment_id != null)
          this.processResponse(response);
        else
          alert('Payment failed..');
      },
      notes: {
        address: 'Book the person and Cook your food'
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed');
        }
      }
    };

    let razorpayObject: any = new Razorpay(options);
    razorpayObject.open();

  }
  processResponse(response: any) {
    console.log(response);
  }
}

