import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { Transaction } from 'src/app/model/payment.model';
import { Recipe } from 'src/app/model/recipe.model';
import { User } from 'src/app/model/user-detail';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentService } from 'src/app/services/payment.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit{

  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  paymentService: PaymentService = inject(PaymentService);
  userService: UserService = inject(UserService);
  recipeService: RecipeService = inject(RecipeService);
  alertService: AlertService = inject(AlertService);
  router: Router = inject(Router);

  transactionId!: string | null;

  transactionDetail: {
    transaction: Transaction,
    bookerUserDetail: User,
    bookedUserRecipeDetail: Recipe,
    bookedUser: User
  } = {
      transaction: {} as Transaction,
      bookerUserDetail: {} as User,
      bookedUserRecipeDetail: {} as Recipe,
      bookedUser: {} as User
    };

  ngOnInit() {
    this.activeRoute.queryParamMap.pipe(
      switchMap((data) => {
        this.transactionId = data.get('detail');
        return this.paymentService.getTransactionById(this.transactionId);
      })
    ).subscribe((transactionResponse) => {
      this.transactionDetail.transaction = transactionResponse;

      forkJoin([
        this.userService.getUserById(this.transactionDetail.transaction.bookerId),
        this.userService.getUserById(this.transactionDetail.transaction.recipeUserId),
        this.recipeService.getRecipeById(this.transactionDetail.transaction.recipeId)
      ]).subscribe({
        next: ([bookerUserResponse, bookedUserResponse, recipeResponse]) => {
          this.transactionDetail.bookerUserDetail = bookerUserResponse;
          this.transactionDetail.bookedUser = bookedUserResponse;
          this.transactionDetail.bookedUserRecipeDetail = recipeResponse;
        },
        error: (err) => this.alertService.showError("Error occurred in showing transactional details")
      });
    });
  }

  onCloseButtonClicked() {
    this.router.navigate(['/admin/transactions']);
  }
}