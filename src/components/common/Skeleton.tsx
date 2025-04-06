import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = true,
  count = 1,
}) => {
  const baseClasses = `bg-gray-200 animate-pulse ${width} ${height} ${
    rounded ? 'rounded-md' : ''
  } ${className}`;

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={baseClasses} />
        ))}
    </>
  );
};

export default Skeleton;