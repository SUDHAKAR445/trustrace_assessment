export class Recipe {
    id?: string;
    title!: string;
    description!: string;
    instructions!: string;
    preparationTime!: number;
    cookingTime!: number;
    servings!: number;
    dateCreated?: Date;
    deletedAt?: Date;
    photo?: string;
    video!: string | undefined;
    likes!: string[];
    category!: {
        id?: string;
        name?: string;
    }
    cuisine!: {
        id?: string;
        name?: string;
    }
    user?: {
        id?: string;
        usernameValue?: string;
        profileImageUrl?: string;
    };
    ingredients!: {
        name?: string;
        quantity?: number;
        unitOfMeasurement?: string;
    }[];

}