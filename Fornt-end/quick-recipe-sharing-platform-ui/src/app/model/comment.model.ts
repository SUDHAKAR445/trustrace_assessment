export class Comment{
    id?: string;
    text!: string;
    userId?: string;
    username?: string;
    profileImageUrl?: string;
    likeCount?: number;
    likes!: string[];
    commentDate?: Date;
}