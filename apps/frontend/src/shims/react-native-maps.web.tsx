import React from 'react';
import { View, type ViewProps } from 'react-native';

type MapProps = ViewProps & {
  initialRegion?: unknown;
  region?: unknown;
};

function MapView({ children, ...props }: MapProps) {
  return <View {...props}>{children}</View>;
}

export function Marker({ children, ...props }: ViewProps) {
  return <View {...props}>{children}</View>;
}

export const PROVIDER_GOOGLE = 'google';

export default MapView;
