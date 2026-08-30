"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async register(dto) {
        const username = dto.username.trim().toLowerCase();
        const { data: existing } = await this.supabase.admin
            .from('user_profiles')
            .select('id')
            .eq('username', username)
            .single();
        if (existing) {
            throw new common_1.BadRequestException('Username already taken');
        }
        const { data, error } = await this.supabase.admin.auth.admin.createUser({
            email: dto.email,
            password: dto.password,
            email_confirm: true,
        });
        if (error || !data.user) {
            throw new common_1.BadRequestException(error?.message || 'Supabase registration failed');
        }
        const { error: profileError } = await this.supabase.admin
            .from('user_profiles')
            .insert({ id: data.user.id, username, full_name: dto.fullName, role: dto.role });
        if (profileError) {
            throw new common_1.BadRequestException('Username or email already exists');
        }
        return {
            message: 'Registration successful',
            userId: data.user.id,
            username,
        };
    }
    async login(dto) {
        let email = dto.identifier.trim();
        if (!email.includes('@')) {
            const username = email.toLowerCase();
            const { data: profile, error: profileErr } = await this.supabase.admin
                .from('user_profiles')
                .select('id')
                .eq('username', username)
                .single();
            if (!profile) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const { data: sbUser, error: sbErr } = await this.supabase.admin.auth.admin.getUserById(profile.id);
            if (sbErr || !sbUser?.user?.email) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            email = sbUser.user.email;
        }
        const { data, error } = await this.supabase.anon.auth.signInWithPassword({
            email,
            password: dto.password,
        });
        if (error || !data.session || !data.user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        let { data: profile } = await this.supabase.admin
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
        if (!profile) {
            await this.supabase.admin.from('user_profiles').insert({
                id: data.user.id,
                username: '',
                full_name: data.user.email || '',
                role: 'student',
            });
            profile = { id: data.user.id, username: '', full_name: data.user.email || '', role: 'student' };
        }
        return {
            accessToken: data.session.access_token,
            user: {
                id: profile.id,
                email: data.user.email || '',
                username: profile.username || '',
                fullName: profile.full_name,
                role: profile.role,
            },
        };
    }
    async getMe(userId) {
        const { data: profile } = await this.supabase.admin
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (!profile)
            throw new common_1.NotFoundException('Profile not found');
        let email = '';
        const { data: sbUser } = await this.supabase.admin.auth.admin.getUserById(userId);
        if (sbUser?.user?.email) {
            email = sbUser.user.email;
        }
        return {
            id: profile.id,
            email,
            username: profile.username || '',
            fullName: profile.full_name,
            role: profile.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map