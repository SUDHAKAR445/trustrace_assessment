import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopComponent } from 'src/app/utility/success-pop/success-pop.component';

declare let Razorpay: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(private paymentService: PaymentService,
    private activateRoute: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router) { }

  paymentForm!: FormGroup;
  bookerId!: string | null;
  recipeId!: string | null;
  payerName!: string | null;
  payerEmail!: string | null;
  payerPhone!: string | null;
  isLoading: boolean = false;

  bookingAmount: number = 100;

  ngOnInit() {

    this.activateRoute.queryParamMap.subscribe((data) => {
      this.bookerId = data.get('id'),
        this.recipeId = data.get('detail')
    });

    this.userService.getUserById(this.bookerId).subscribe((data) => {
      this.payerName = data.usernameValue,
        this.payerEmail = data.email,
        this.payerPhone = data.contact
    });

    this.paymentForm = new FormGroup({
      bookerId: new FormControl(this.bookerId, Validators.required),
      recipeId: new FormControl(this.recipeId, Validators.required),
      amount: new FormControl(100, Validators.required)
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
    this.isLoading = true;
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
            next: (response) => {
              const dialogRef = this.dialog.open(SuccessPopComponent);
              this.isLoading = false;
              dialogRef.afterClosed().subscribe((result) => {
                this.router.navigate(['/user/feed']);
              });
            }
          });
        }
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
              this.isLoading = false;
              alert('Payment failed..');
              this.router.navigate(['/user/feed']);
            },
          });
        }
      }
    };

    let razorpayObject: any = new Razorpay(options);
    razorpayObject.open();

  }
}

