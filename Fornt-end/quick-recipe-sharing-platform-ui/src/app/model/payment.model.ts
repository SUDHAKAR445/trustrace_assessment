export class Payment {
    bookerId!: string;
    recipeId!: string;
    amount!: string;
}

export class Transaction {
    id!: string;
    orderId!: string;
    paymentId!: string;
    amount!: string;
    currency!: number;
    bookerId!: string;
    bookerUsername!: string;
    bookerProfileImage!: string;
    bookerContact!: number;
    recipeId!: string;
    recipeTitle!: string;
    recipeUserId!: string;
    recipeUsername!: string;
    recipeUserProfile!: string;
    orderCreatedAt!: Date;
    orderCompletedAt!: Date;
    orderStatus!: string;
    wallet!: number;
}