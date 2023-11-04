import React from 'react';
import { components } from '@components';
import { useBindings } from '@hooks';

export const WidgetComponent = ({ widgetComponent }: any) => {
  const { name, props, bindings, children } = widgetComponent;
  const bindingProps = useBindings(bindings);

  const Component = components[name];
  if (Component == null) {
    return <div>No {name} component found.</div>;
  }

  return (
    <Component {...props} {...bindingProps}>
      {children?.map((child: any) => (
        <WidgetComponent key={child.id} widgetComponent={child} />
      ))}
    </Component>
  );
};
