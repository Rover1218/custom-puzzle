export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    fullName: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: UserResponse;
}
