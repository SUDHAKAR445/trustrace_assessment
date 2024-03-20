import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Payment, Transaction } from 'src/app/model/payment.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, OnDestroy{

  paymentService: PaymentService = inject(PaymentService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  alertService: AlertService = inject(AlertService);

  userId!: string | null | undefined;
  errorMessage!: string | null;
  bookings: Transaction[] = [];
  page = 0;
  pageSize = 100;
  isLoading: boolean = false;
  hasLoadedInitialData: boolean = false;
  showNoBookingsMessage: boolean = false;
  userIdSubscription!: Subscription;

  ngOnInit() {
    this.userIdSubscription = this.authService.user.subscribe((data) => {
      this.userId = data?.id;
    })

    this.loadBookings();
  }

  loadBookings(): void {
    if (this.isLoading) {
      return;
    }

    this.paymentService.getTransactionByUserId(this.userId, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.bookings = [...this.bookings, ...response.content];
        this.page++;
        this.isLoading = false;

        if (!this.hasLoadedInitialData && response.content.length === 0) {
          const delayTime = 500;

          setTimeout(() => {
            this.showNoBookingsMessage = true;
          }, delayTime);
        }

        this.hasLoadedInitialData = true;
      },
      error: (error) => {
        this.alertService.showError('Error occurred in displaying the bookings')
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.loadBookings();
    }
  }

  showTransactionDetails(id: string) {
    this.router.navigate(['/user/booking/detail'], { queryParams: { "detail": id } });
  }

  ngOnDestroy(): void {
    this.userIdSubscription.unsubscribe();
  }
}
