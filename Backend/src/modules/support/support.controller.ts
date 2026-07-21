import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getTickets() { return this.supportService.getTickets(); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  getTicket(@Param('id') id: string) { return this.supportService.getTicket(id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/reply')
  replyToTicket(@Param('id') id: string, @Body() data: { message: string }) {
    return this.supportService.replyToTicket(id, data.message);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/close')
  closeTicket(@Param('id') id: string) {
    return this.supportService.closeTicket(id);
  }
}
