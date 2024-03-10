import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopComponent } from 'src/app/utility/success-pop/success-pop.component';
import { IDeactivateComponent } from 'src/app/model/canActivate.model';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from 'src/app/services/alert.service';

declare let Razorpay: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, IDeactivateComponent {

  constructor(private paymentService: PaymentService,
    private activateRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private router: Router) { }

  paymentForm!: FormGroup;
  bookerId!: string | null;
  recipeId!: string | null;
  payerName!: string | null;
  payerEmail!: string | null;
  payerPhone!: string | null;
  isLoading: boolean = false;
  isSubmitted: boolean = false;

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
    this.alertService.confirm('Confirm', 'Are you sure do you book this recipe?').then((isConfirmed) => {
      if (isConfirmed) {
        this.isSubmitted = true;
        this.paymentService.createTransaction(this.paymentForm.value).subscribe({
          next: response => {
            this.openTransactionModel(response);
          },
          error: response => {
            this.alertService.showError('Error occurred in booking the recipe');
          }
        });
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
              this.alertService.confirm('Info','Your booking is successfully and you order is sent to your mail. Now click OK to see detail').then((isConfirmed) => {
                if(isConfirmed) {
                  this.router.navigate(['/user/booking']);
                } else {
                  this.router.navigate(['/user/feed']);
                }
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
              this.alertService.showError('Booking is Failed..');
              this.router.navigate(['/user/feed']);
            },
          });
        }
      }
    };

    let razorpayObject: any = new Razorpay(options);
    razorpayObject.open();
  }

  canExit(): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.isSubmitted) {
      return this.alertService.confirmExit();
    } else {
      return true;
    }
  }
}

