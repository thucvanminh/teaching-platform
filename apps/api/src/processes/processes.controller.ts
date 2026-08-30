import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProcessDto, UpdateProcessDto } from './dto/process.dto';
import { ProcessesService } from './processes.service';

@Controller('processes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProcessesController {
  constructor(private service: ProcessesService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user.userId, req.user.role);
  }

  @Post()
  @Roles('teacher')
  create(@Body() dto: CreateProcessDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Put(':id')
  @Roles('teacher')
  update(@Param('id') id: string, @Body() dto: UpdateProcessDto, @Req() req: any) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @Roles('teacher')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user.userId);
  }
}
