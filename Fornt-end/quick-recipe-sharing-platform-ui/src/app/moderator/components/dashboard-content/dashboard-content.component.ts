import { Component, OnInit, inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss']
})
export class DashboardContentComponent implements OnInit{
  dashboardService: DashboardService = inject(DashboardService);
  alertService: AlertService = inject(AlertService);

  dashboardDetail!: { key: string, value: { [key: string]: number } }[];
  intervalSubscription: Subscription | undefined;

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.dashboardService.getModeratorDashboardContent().subscribe({
      next: (response) => {
        this.dashboardDetail = response;
        this.startInterval();
      },
      error: (error) => {
        this.alertService.showError("Failed to load the dashboard content");
      }
    });
  }

  startInterval() {
    if (!this.intervalSubscription) {
      this.intervalSubscription = interval(5000).subscribe(() => {
        this.fetchDashboardData();
      });
    }
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}
