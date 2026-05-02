import { ReactNode } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

interface StripeProviderWrapperProps {
  publishableKey: string;
  children: ReactNode;
}

export function StripeProviderWrapper({
  publishableKey,
  children,
}: StripeProviderWrapperProps) {
  return <StripeProvider publishableKey={publishableKey}>{children}</StripeProvider>;
}
