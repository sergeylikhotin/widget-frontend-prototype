import { Container } from './common/Container.tsx';
import { Initial } from './common/Initial.tsx';
import { Text } from './common/Text.tsx';
import { Image } from './common/Image.tsx';
import React from 'react';
import { WidgetComponent } from './WidgetComponent.tsx';

export const components: Record<string, React.ComponentType<any>> = {
  Initial,

  RootContainer: Container,
  Container,

  Text,
  Image
};
export { WidgetComponent };
