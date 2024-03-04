import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user-detail';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {

  errorMessage!: string | null;
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'First Name', 'Last Name', 'Gender', 'Contact', 'Role', 'CreatedAt', 'UpdatedAt', 'DeletedAt', 'Wallet', 'Actions'];
  dataSource = new MatTableDataSource<User>();

  router: Router;

  constructor(private userService: UserService, private changeDetectorRef: ChangeDetectorRef, @Inject(Router) router: Router) {
    this.router = router;
  }

  selectedRole : string = '';
  selectedGender : string = '';
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
    if (!inputValue.trim() && !this.selectedRole && !this.selectedGender) {
      
      this.loadPage(this.paginator.pageIndex, this.paginator.pageSize);
    } else {
      this.makeApiCall(inputValue, this.selectedRole, this.selectedGender, this.paginator.pageIndex, this.paginator.pageSize);
    }
  }

  makeApiCall(inputValue: string, selectedRole: string,  selectedGender: string, pageIndex: number, pageSize: number) {
    this.userService.searchUsers(inputValue, selectedRole, selectedGender, pageIndex, pageSize).subscribe({
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
    });
  }

  loadPage(pageIndex: number, pageSize: number) {
    this.userService.getAllUsers(pageIndex, pageSize).subscribe({
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
    });
  }

  onCreateClicked() {
    this.router.navigate(['/admin/users/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { detail: id } });
  }

  onDeleteClicked(id: string) {
    this.userService.deleteUserById(id).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    });
  }

  onEditClicked(id: string | undefined) {
    this.router.navigate(['/admin/users/update'], { queryParams: { detail: id } });
  }

  searchText(value: string) {
    console.log(value);
  }

  onCancelClicked(){
    window.history.go(-1);
  }

  
}
