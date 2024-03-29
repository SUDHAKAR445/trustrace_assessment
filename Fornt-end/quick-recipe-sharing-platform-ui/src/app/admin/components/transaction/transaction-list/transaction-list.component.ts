import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Transaction } from 'src/app/model/payment.model';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentService } from 'src/app/services/payment.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements AfterViewInit {

  paymentService: PaymentService = inject(PaymentService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);
  
  displayedColumns: string[] = ['S.No', 'Order Id', 'Amount', 'Booker Profile', 'Booker Username', 'Booker Contact', 'Recipe Title', 'Recipe User Profile', 'Recipe Username', 'Wallet', 'Created At', 'Completed At', 'Status'];
  dataSource = new MatTableDataSource<Transaction>();

  dateFilter = new FormGroup({
    start: new FormControl(new Date(year - 1, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });
  
  selectedStatus!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('message') messageRef!: ElementRef;

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe({
        next: (page: any) => this.loadPage(page.pageIndex, page.pageSize)
      });
      this.loadPage(0, 10);
    }
    this.changeDetectorRef.detectChanges();

    this.messageRef.nativeElement.addEventListener('input', () => {
      this.applyFilters();
    })
  }

  applyFilters() {
    const inputValue = this.messageRef.nativeElement.value;
    if(!this.selectedStatus && !inputValue && !this.dateFilter.value) {
      this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.makeApiCall(inputValue, this.selectedStatus, this.dateFilter.value.start, this.dateFilter.value.end, this.paginator.pageIndex, this.paginator.pageSize);
    }
  }

  makeApiCall(inputValue: string, status: string, start: Date | null | undefined, end: Date | null | undefined, pageIndex: number, pageSize: number) {
    this.paymentService.searchTransaction(inputValue, status, start, end, pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error in applying the filter");
      }
    })
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.paymentService.getAllTransactions(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Failed to load Transaction list");
      }
    })
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { detail: id } });
  }

  showRecipeDetail(id: string) {
    this.router.navigate(['/admin/recipes/detail'], { queryParams: { detail: id } });
  }

  showTransactionDetail(id: string) {
    this.router.navigate(['/admin/transactions/detail'], { queryParams: { detail: id} });
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateFilter.patchValue({
      start: event.value,
    });
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateFilter.patchValue({
      end: event.value,
    });
  }

  onDateChange() {
    this.applyFilters();
  }
}

