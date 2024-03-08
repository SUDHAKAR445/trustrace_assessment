import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {
  constructor(public dialogRef: MatDialogRef<ReportDialogComponent>) { }

  reportReason!: string;

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onReportClick(): void {
    this.dialogRef.close(this.reportReason);
  }

  checkLength(): boolean {
    return !!this.reportReason && this.reportReason.length > 0;
  }
}
