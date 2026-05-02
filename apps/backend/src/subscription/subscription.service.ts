import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { SubscriptionPlan, SubscriptionStatus } from '@tariq/shared';
import { Subscription } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  private stripe: Stripe;
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2023-10-16' as any,
      });
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not found in environment variables');
    }
  }

  async getSubscription(userId: string): Promise<Subscription> {
    let subscription = await this.subscriptionRepository.findOne({ where: { userId } });
    if (!subscription) {
      subscription = this.subscriptionRepository.create({
        userId,
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.ACTIVE,
      });
      await this.subscriptionRepository.save(subscription);
    }
    return subscription;
  }

  async createCheckoutSession(userId: string, plan: SubscriptionPlan) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subscription = await this.getSubscription(userId);

    const priceId = this.getPriceIdForPlan(plan);
    if (!priceId) {
      throw new Error('Invalid plan or price ID not configured');
    }

    let customerId = subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      subscription.stripeCustomerId = customerId;
      await this.subscriptionRepository.save(subscription);
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.configService.get('FRONTEND_URL', 'http://localhost:19006')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL', 'http://localhost:19006')}/subscription/cancel`,
      metadata: { userId, plan },
    });

    return { sessionId: session.id, url: session.url };
  }

  async createSubscription(userId: string, plan: SubscriptionPlan) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subscription = await this.getSubscription(userId);
    const priceId = this.getPriceIdForPlan(plan);
    if (!priceId) {
      throw new Error('Invalid plan or price ID not configured');
    }

    let customerId = subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      subscription.stripeCustomerId = customerId;
      await this.subscriptionRepository.save(subscription);
    }

    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2023-10-16' as any }
    );

    const stripeSubscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { userId, plan },
    });

    const latestInvoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice?.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: stripeSubscription.id,
      clientSecret: paymentIntent?.client_secret,
      customerId: customerId,
      ephemeralKey: ephemeralKey.secret,
    };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        invoice.subscription as string,
      );
      await this.handleSubscriptionUpdated(stripeSubscription);
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as SubscriptionPlan;
    const subscriptionId = session.subscription as string;

    if (!userId || !plan || !subscriptionId) {
      this.logger.error('Missing metadata in checkout session');
      return;
    }

    const stripeSubscription = await this.stripe.subscriptions.retrieve(subscriptionId);

    await this.subscriptionRepository.update(
      { userId },
      {
        plan,
        stripeSubscriptionId: subscriptionId,
        status: this.mapStripeStatus(stripeSubscription.status),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    );
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      subscription.status = this.mapStripeStatus(stripeSubscription.status);
      subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
      subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;
      await this.subscriptionRepository.save(subscription);
    }
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    await this.subscriptionRepository.update(
      { stripeSubscriptionId: stripeSubscription.id },
      {
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.CANCELED,
      },
    );
  }

  private getPriceIdForPlan(plan: SubscriptionPlan): string | null {
    switch (plan) {
      case SubscriptionPlan.PREMIUM:
        return this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID') || null;
      case SubscriptionPlan.FAMILY:
        return this.configService.get<string>('STRIPE_FAMILY_PRICE_ID') || null;
      default:
        return null;
    }
  }

  private mapStripeStatus(status: string): SubscriptionStatus {
    switch (status) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      case 'incomplete':
        return SubscriptionStatus.INCOMPLETE;
      case 'incomplete_expired':
        return SubscriptionStatus.INCOMPLETE_EXPIRED;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'trialing':
        return SubscriptionStatus.TRIALING;
      case 'unpaid':
        return SubscriptionStatus.UNPAID;
      default:
        return SubscriptionStatus.INCOMPLETE;
    }
  }
}
