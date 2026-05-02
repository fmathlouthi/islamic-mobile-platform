import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionPlan, SubscriptionStatus } from '@tariq/shared';
import { SubscriptionService } from '../subscription.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.getAllAndOverride<SubscriptionPlan[]>(
      'plans',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPlans || requiredPlans.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const subscription = await this.subscriptionService.getSubscription(user.id);

    if (
      subscription.status === SubscriptionStatus.ACTIVE ||
      subscription.status === SubscriptionStatus.TRIALING
    ) {
      if (requiredPlans.includes(SubscriptionPlan.PREMIUM)) {
        return (
          subscription.plan === SubscriptionPlan.PREMIUM ||
          subscription.plan === SubscriptionPlan.FAMILY
        );
      }

      if (requiredPlans.includes(SubscriptionPlan.FAMILY)) {
        return subscription.plan === SubscriptionPlan.FAMILY;
      }
    }

    throw new ForbiddenException(
      'This feature requires a premium subscription.',
    );
  }
}
