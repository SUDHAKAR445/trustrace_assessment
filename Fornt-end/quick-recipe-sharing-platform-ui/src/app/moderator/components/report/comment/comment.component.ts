import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Report } from 'src/app/model/report.model';
import { AlertService } from 'src/app/services/alert.service';
import { ReportService } from 'src/app/services/report.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements AfterViewInit {

  router: Router = inject(Router);
  reportService: ReportService = inject(ReportService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);

  displayedColumns: string[] = ['S.No', 'Reporter Profile', 'Reporter Username', 'Reported Comment', 'Comment User Profile', 'Comment Username', 'Reported Text', 'Reported Date', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<Report>();
  selectedStatus!: string;

  dateFilter = new FormGroup({
    start: new FormControl(new Date(year - 1, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('message') messageRef!: ElementRef;

  ngAfterViewInit() {
    this.loadPage(0, 10);
    this.changeDetectorRef.detectChanges();

    this.messageRef.nativeElement.addEventListener('input', () => {
      this.applyFilters();
    });
  }
  applyFilters() {
    const inputValue = this.messageRef.nativeElement.value;
    if (!this.selectedStatus && !this.dateFilter.value && !inputValue) {
      this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.makeApiCall(inputValue, this.selectedStatus, this.dateFilter.value.start, this.dateFilter.value.end, this.paginator.pageIndex, this.paginator.pageSize);
    }
  }

  makeApiCall(inputValue: string, status: string, start: Date | null | undefined, end: Date | null | undefined, pageIndex: number, pageSize: number) {
    this.reportService.getAllReportedCommentStatus(inputValue, status, start, end, pageIndex, pageSize).subscribe({
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
    this.reportService.getAllReportedComment(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error occurred in displaying the reported comment");
      }
    })
  }

  onReportClicked(id: string) {
    this.alertService.confirm("Confirm", "Are you sure you want to update this report?").then((confirmed) => {
      if(confirmed) {
        this.router.navigate(['/moderator/report/comments/detail'], { queryParams: { detail: id } });
      }
    });
  }

  onEditClicked(id: string) {
    this.alertService.confirm("Confirm", "Are you sure you want to update this report?").then((confirmed) => {
      if(confirmed) {
        this.router.navigate(['/moderator/report/comments/detail'], { queryParams: { detail: id } });
      }
    });
  }

  showDetail(id: string) {
    this.router.navigate(['/moderator/users/detail'], { queryParams: { detail: id } });
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

