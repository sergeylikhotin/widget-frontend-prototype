import React from 'react';

export type ImageProps = {
  url: string;
};
export const Image: React.FC<ImageProps> = ({ url }) => (
  <img src={url} alt="" />
);
