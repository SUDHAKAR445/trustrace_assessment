import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { Transaction } from 'src/app/model/payment.model';
import { Recipe } from 'src/app/model/recipe.model';
import { User } from 'src/app/model/user-detail';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-bookings-detail',
  templateUrl: './bookings-detail.component.html',
  styleUrls: ['./bookings-detail.component.scss']
})
export class BookingsDetailComponent {
  constructor(private sanitizer: DomSanitizer) {}
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  paymentService: PaymentService = inject(PaymentService);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  recipeService: RecipeService = inject(RecipeService);
  router: Router = inject(Router);

  transactionId!: string | null;
  userId!: string | null | undefined;
  videoId!: string ;
  extractedId!: string;

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
    this.authService.user.subscribe((data) => {
      this.userId = data?.id;
    })

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
        error: (err) => console.log(err),
      });
    });
  }

  onCloseButtonClicked() {
    this.router.navigate(['/user/booking']);
  }

  
  getVideoUrl(videoId: string | undefined): SafeResourceUrl | undefined {
    if (videoId) {
        const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.extractVideoId(videoId)}`);
        return sanitizedUrl;
    }
    return undefined;
}

  extractVideoId(videoUrl: string): string | undefined {
    const match = videoUrl.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : undefined;
  }
}
