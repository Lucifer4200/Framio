'use client';

import React from 'react';

type MetrixCardProps = {
  title: string;
  value: string | number;
  delta?: string | number;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  footerText?: string;
  bgIconClass?: string; // Tailwind bg class for icon circle
};

export default function MetrixCard({
  title,
  value,
  delta,
  deltaPositive = true,
  icon,
  footerText = 'View more...',
  bgIconClass = 'bg-gray-100',
}: MetrixCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 relative">
      {delta !== undefined && (
        <div className={`absolute top-4 right-4 text-sm font-medium ${deltaPositive ? 'text-green-500' : 'text-red-400'}`}>
          {deltaPositive ? `+${delta}` : delta}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${bgIconClass} flex items-center justify-center`}>
          {icon}
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{title}</span>
          <span className="text-2xl font-semibold text-gray-800">{value}</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-400">{footerText}</div>
    </div>
  );
}
