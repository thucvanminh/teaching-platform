import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  async register(dto: RegisterDto) {
    const username = dto.username.trim().toLowerCase();

    const { data: existing } = await this.supabase.admin
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (existing) {
      throw new BadRequestException('Username already taken');
    }

    const { data, error } = await (this.supabase.admin.auth as any).admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
    });

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'Supabase registration failed');
    }

    const { error: profileError } = await this.supabase.admin
      .from('user_profiles')
      .insert({ id: data.user.id, username, full_name: dto.fullName, role: dto.role });

    if (profileError) {
      throw new BadRequestException('Username or email already exists');
    }

    return {
      message: 'Registration successful',
      userId: data.user.id,
      username,
    };
  }

  async login(dto: LoginDto) {
    let email = dto.identifier.trim();

    if (!email.includes('@')) {
      const username = email.toLowerCase();
      const { data: profile } = await this.supabase.admin
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (!profile) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { data: sbUser, error: sbErr } = await (this.supabase.admin.auth as any).admin.getUserById(profile.id);
      if (sbErr || !sbUser?.user?.email) {
        throw new UnauthorizedException('Invalid credentials');
      }
      email = sbUser.user.email;
    }

    const { data, error } = await (this.supabase.anon.auth as any).signInWithPassword({
      email,
      password: dto.password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
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

  async getMe(userId: string) {
    const { data: profile } = await this.supabase.admin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new NotFoundException('Profile not found');

    let email = '';
    const { data: sbUser } = await (this.supabase.admin.auth as any).admin.getUserById(userId);
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
}
