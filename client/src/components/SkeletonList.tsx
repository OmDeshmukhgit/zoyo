import React from "react";

const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border border-zomato-borderGray bg-white/80 p-4 shadow-sm animate-pulse">
    <div className="h-40 w-full rounded-xl bg-zomato-lightGray/70 mb-4" />
    <div className="h-4 w-3/4 bg-zomato-lightGray/70 rounded mb-2" />
    <div className="h-4 w-1/2 bg-zomato-lightGray/60 rounded mb-4" />
    <div className="flex justify-between">
      <div className="h-4 w-1/4 bg-zomato-lightGray/60 rounded" />
      <div className="h-4 w-1/5 bg-zomato-lightGray/60 rounded" />
    </div>
  </div>
);

interface SkeletonListProps {
  count?: number;
}

const SkeletonList: React.FC<SkeletonListProps> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export default SkeletonList;


