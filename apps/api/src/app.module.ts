import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProcessesModule } from './processes/processes.module';
import { LessonsModule } from './lessons/lessons.module';
import { StudentProcessesModule } from './student-processes/student-processes.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    ProcessesModule,
    LessonsModule,
    StudentProcessesModule,
  ],
})
export class AppModule {}
