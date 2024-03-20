import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, Inject, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user-detail';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {

  router: Router = inject(Router);
  userService: UserService = inject(UserService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  alertService: AlertService = inject(AlertService);
  
  createUserClicked: boolean = false;
  displayedColumns: string[] = ['S.No', 'Profile', 'Username', 'First Name', 'Last Name', 'Gender', 'Contact', 'Role', 'CreatedAt', 'UpdatedAt', 'DeletedAt', 'Wallet', 'Actions'];
  dataSource = new MatTableDataSource<User>();
  selectedRole : string = '';
  selectedGender : string = '';

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
        this.alertService.showError('Error in applying the filter');
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
        this.alertService.showError('Error in displaying the user list');
      }
    });
  }

  onCreateClicked() {
    this.router.navigate(['/admin/users/create']);
  }

  showDetail(id: string) {
    this.router.navigate(['/admin/users/detail'], { queryParams: { detail: id } });
  }

  onDeleteClicked(id: string, deletedAt: string) {
    if(!deletedAt) {
      this.alertService.confirmDelete('Confirm', "Are you sure do you want to delete this user").then((isConfirmed) => {
        if(isConfirmed) {
          this.userService.deleteUserById(id).subscribe({
            next: (response) => {
              this.alertService.showSuccess("User deleted successfully");
              this.router.navigate(['/admin/users']);
            },
            error: (error) => {
              this.alertService.showSuccess("Error occurred in deleting the user");
              this.router.navigate(['/admin/users']);
            }
          });
        } else {
          this.router.navigate(['/admin/users']);
        }
      });
    } else {
      this.alertService.confirmDelete('Confirm', "Are you sure do you want to revoke this user").then((isConfirmed) => {
        if(isConfirmed) {
          this.userService.deleteUserById(id).subscribe({
            next: (response) => {
              this.alertService.showSuccess("User revoked successfully");
              this.router.navigate(['/admin/users']);
            },
            error: (error) => {
              this.alertService.showSuccess("Error occurred in revoking the user");
              this.router.navigate(['/admin/users']);
            }
          });
        } else {
          this.router.navigate(['/admin/users']);
        }
      });
    }
  }

  onEditClicked(id: string | undefined) {
    this.alertService.confirm('Confirm', 'Are you sure do you want to edit this user').then((isConfirmed) => {
      this.router.navigate(['/admin/users/update'], { queryParams: { detail: id } });
    });
  }

  onCancelClicked(){
    window.history.go(-1);
  }
}
