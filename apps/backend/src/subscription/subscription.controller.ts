import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request as NestRequest,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionPlan } from '@tariq/shared';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription' })
  async getSubscription(@NestRequest() req: Request & { user: any }) {
    return this.subscriptionService.getSubscription(req.user.id);
  }

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  async createCheckoutSession(@NestRequest() req: Request & { user: any }, @Body('plan') plan: SubscriptionPlan) {
    return this.subscriptionService.createCheckoutSession(req.user.id, plan);
  }

  @Post('create-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe subscription (Native)' })
  async createSubscription(@NestRequest() req: Request & { user: any }, @Body('plan') plan: SubscriptionPlan) {
    return this.subscriptionService.createSubscription(req.user.id, plan);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @NestRequest() req: RawBodyRequest<Request>,
  ) {
    return this.subscriptionService.handleWebhook(signature, req.rawBody!);
  }
}
