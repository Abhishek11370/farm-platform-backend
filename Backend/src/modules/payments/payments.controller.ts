import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Request, Req
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Create a payment order for a given order ID */
  @Post('create-order')
  createOrder(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createOrder(dto);
  }

  /** Verify Razorpay payment */
  @Post('verify')
  verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  /** Webhook from Razorpay */
  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }

  /** Get payment details by order ID */
  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  /** Admin: get all payments */
  @Roles('ADMIN')
  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.paymentsService.findAll(+page, +limit);
  }

  @Get("farmer")
  @Roles(Role.FARMER)
  async getFarmerPayments(@Req() req: AuthenticatedRequest) {
    return [];
  }

  @Get("my")
  async getMyPayments(@Req() req: AuthenticatedRequest) {
    return [];
  }

}
