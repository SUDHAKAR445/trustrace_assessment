import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cuisine } from 'src/app/model/cuisine.model';
import { User } from 'src/app/model/user-detail';
import { CuisineService } from 'src/app/services/cuisine.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cuisine-list',
  templateUrl: './cuisine-list.component.html',
  styleUrls: ['./cuisine-list.component.scss']
})
export class CuisineListComponent implements AfterViewInit {

  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Cuisine Name', 'Total Recipe Posted'];
  dataSource = new MatTableDataSource<Cuisine>();

  router: Router = inject(Router);

  constructor(private cuisineService: CuisineService, private changeDetectorRef: ChangeDetectorRef) {
  }

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
      const inputValue = this.messageRef.nativeElement.value;
      
      if (inputValue.trim() === '') {
        this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.makeApiCall(inputValue, this.paginator.pageIndex, this.paginator.pageSize);
      }
    });
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
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
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }

  onCreateClicked() {
    this.router.navigate(['/admin/cuisines/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/cuisines/detail'], {queryParams:{detail: id}});
  }
}
