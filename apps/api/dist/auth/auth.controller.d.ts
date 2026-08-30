import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        userId: any;
        username: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: any;
        user: {
            id: any;
            email: any;
            username: any;
            fullName: any;
            role: any;
        };
    }>;
    getMe(req: any): Promise<{
        id: any;
        email: string;
        username: any;
        fullName: any;
        role: any;
    }>;
}
