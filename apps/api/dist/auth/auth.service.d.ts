import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private supabase;
    constructor(supabase: SupabaseService);
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
    getMe(userId: string): Promise<{
        id: any;
        email: string;
        username: any;
        fullName: any;
        role: any;
    }>;
}
