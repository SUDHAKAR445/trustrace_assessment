export class Report {
    id?: string;
    reportText!: string;
    reportedDate!: Date;
    status!: string;

    reporterUserId!: string;
    reporterUserImage!: string;
    reporterUsername!: string;

    reportedUserId!: string;
    reportedUserImage!: string;
    reportedUsername!: string;

    commentId!: string;
    commentText!: string;
    commentUserProfileImage!: string;
    commentUserId!: string;
    commentUsername!: string;

    recipeId!: string;
    recipeTitle!: string;
    recipeUserId!: string;
    recipeUserProfileImage!: string;
    recipeUsername!: string;
}