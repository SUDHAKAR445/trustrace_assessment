import { Component, inject } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent {
  dashboardService: DashboardService = inject(DashboardService);
  alertService: AlertService = inject(AlertService);

  dashboardDetail!: { key: string, value: { [key: string]: number } }[];

  ngOnInit() {
    this.dashboardService.getModeratorDashboardContent().subscribe({
      next: (response) => {
        this.dashboardDetail = response;
      },
      error: (error) => {
        this.alertService.showError('Failed to load to the dashboard content');
      }
    })
  }
}
