import { SetMetadata } from '@nestjs/common';
import { SubscriptionPlan } from '@tariq/shared';

export const Plans = (...plans: SubscriptionPlan[]) => SetMetadata('plans', plans);
