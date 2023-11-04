import React from 'react';

export type ContainerProps = {
  children: React.ReactNode[];
};
export const Container: React.FC<ContainerProps> = ({ children }) => (
  <div>{children}</div>
);
