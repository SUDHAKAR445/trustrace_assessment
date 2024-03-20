import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cuisine } from 'src/app/model/cuisine.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { CuisineService } from 'src/app/services/cuisine.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cuisine-list',
  templateUrl: './cuisine-list.component.html',
  styleUrls: ['./cuisine-list.component.scss']
})
export class CuisineListComponent implements AfterViewInit {

  router: Router = inject(Router);
  cuisineService: CuisineService = inject(CuisineService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);

  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Cuisine Name', 'Total Recipe Posted'];
  dataSource = new MatTableDataSource<Cuisine>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('message') messageRef!: ElementRef;

  ngAfterViewInit() {
    this.loadPage(0, 10);
    this.messageRef.nativeElement.addEventListener('input', () => {
      const inputValue = this.messageRef.nativeElement.value;
      
      if (inputValue.trim() === '') {
        this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.makeApiCall(inputValue, this.paginator.pageIndex, this.paginator.pageSize);
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  makeApiCall(inputValue: string, pageIndex: number, pageSize: number) {

    this.cuisineService.searchCuisine(inputValue, pageIndex, pageSize).subscribe({
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
    this.cuisineService.getAllCuisineList(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number;
        this.paginator.pageSize = response.size;
      },
      error: (error) => {
        this.alertService.showError("Error in displaying the Cuisine");
      }
    })
  }

  onCreateClicked() {
    this.router.navigate(['/admin/cuisines/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/cuisines/detail'], { queryParams: { detail: id } });
  }
}
