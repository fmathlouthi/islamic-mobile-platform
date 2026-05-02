import { ReactNode } from 'react';

interface StripeProviderWrapperProps {
  publishableKey: string;
  children: ReactNode;
}

export function StripeProviderWrapper({
  publishableKey: _publishableKey,
  children,
}: StripeProviderWrapperProps) {
  return <>{children}</>;
}
