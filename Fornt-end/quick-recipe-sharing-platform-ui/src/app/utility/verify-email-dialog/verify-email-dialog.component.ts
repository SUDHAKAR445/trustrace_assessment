import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-email-dialog',
  templateUrl: './verify-email-dialog.component.html',
  styleUrls: ['./verify-email-dialog.component.scss']
})
export class VerifyEmailDialogComponent {
  constructor(private dialog: MatDialog) {}

  openVerifyEmailDialog(): void {
    this.dialog.open(VerifyEmailDialogComponent);
  }
}
