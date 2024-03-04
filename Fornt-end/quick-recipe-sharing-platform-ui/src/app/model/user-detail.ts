export class User {
    id?: string ;
    firstName!: string;
    lastName!: string;
    gender!: string;
    contact!: string;
    role!: string;
    email!: string;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date;
    usernameValue!: string;
    password?: string;
    profileImageUrl!: string;
    wallet!: number;
}