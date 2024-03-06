import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Payment, Transaction } from 'src/app/model/payment.model';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent {

  userId!: string | null | undefined;
  errorMessage!: string | null;
  bookings: Transaction[] = [];
  page = 0;
  pageSize = 10;
  isLoading: boolean = false;
  hasLoadedInitialData: boolean = false;
  showNoBookingsMessage: boolean = false;

  paymentService: PaymentService = inject(PaymentService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {
    this.authService.user.subscribe((data) => {
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
        this.isLoading = false;
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
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
}
