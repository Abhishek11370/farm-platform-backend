import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  root() {
    return {
      status: 'ok',
      service: 'farm-platform-backend',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/health')
  health() {
    return { status: 'healthy' };
  }
}
