import React from 'react';
import './Skeleton.css';

function Skeleton({ width, height, borderRadius = '4px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export default Skeleton;