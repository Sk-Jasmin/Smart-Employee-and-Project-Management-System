import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${
        circle ? 'rounded-full' : 'rounded-md'
      } ${className}`}
      style={{
        width: width || undefined,
        height: height || undefined
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-[#f8f9fa] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-2xs">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-12" circle />
    </div>
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-2 p-4">
    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    ))}
  </div>
);
