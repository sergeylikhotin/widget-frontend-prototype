import React from 'react';

export type TextProps = {
  value: any;
};
export const Text: React.FC<TextProps> = ({ value }) => (
  <p>{value.toString()}</p>
);
