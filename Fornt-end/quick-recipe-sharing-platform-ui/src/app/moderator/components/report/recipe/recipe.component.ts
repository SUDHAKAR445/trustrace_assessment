import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Report } from 'src/app/model/report.model';
import { ReportService } from 'src/app/services/report.service';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements AfterViewInit {

  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Reporter Profile', 'Reporter Username', 'Recipe Title', 'Recipe User Profile', 'Recipe Username', 'Reported Text', 'Reported Date', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<Report>();
  selectedStatus!: string;

  router: Router = inject(Router);

  constructor(private reportService: ReportService, private changeDetectorRef: ChangeDetectorRef) {
  }

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year - 1, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

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
    });
  }
  applyFilters() {
    const inputValue = this.messageRef.nativeElement.value;
    if(!this.selectedStatus && !this.campaignOne.value && !inputValue) {
      this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.makeApiCall(inputValue, this.selectedStatus, this.campaignOne.value.start, this.campaignOne.value.end, this.paginator.pageIndex, this.paginator.pageSize);
    }
  }

  makeApiCall(inputValue: string, status: string, start: Date | null | undefined, end: Date | null | undefined, pageIndex: number, pageSize: number) {
    this.reportService.getAllReportedRecipeStatus(inputValue, status, start, end, pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.reportService.getAllReportedRecipe(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }

  onReportClicked(id: string) {
    this.router.navigate(['/moderator/report/recipes/detail'], {queryParams:{detail: id}});
  }

  onEditClicked(id: string) {
    this.router.navigate(['/moderator/report/recipes/detail'], {queryParams:{detail: id}});
  }

  onDeleteClicked(id: string) {
    this.reportService.deleteReportById(id).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/report/recipes']);
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.campaignOne.patchValue({
      start: event.value,
    });
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.campaignOne.patchValue({
      end: event.value,
    });
  }

  onDateChange() {
    this.applyFilters();
  }
}

