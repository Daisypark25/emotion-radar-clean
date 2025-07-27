import React from 'react';
import Skeleton from '../common/Skeleton';

function TherapistDetailSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
      <Skeleton width="72px" height="72px" borderRadius="12px" />
      <Skeleton width="50%" height="20px" />
      <Skeleton width="30%" height="16px" />
      <Skeleton width="100%" height="60px" />
      <Skeleton width="100%" height="60px" />
      <Skeleton width="100%" height="60px" />
    </div>
  );
}

export default TherapistDetailSkeleton;