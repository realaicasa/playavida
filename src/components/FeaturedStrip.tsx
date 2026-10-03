import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedStrip: React.FC<{ title: string; items: any[] }> = ({ title, items }) => (
  <div className="py-4 space-y-2">
    <h3 className="text-sm font-bold text-stone-900 px-4">{title}</h3>
    <div className="flex gap-4 px-4 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((item, i) => (
        <div key={i} className="min-w-[140px] h-[100px] bg-stone-100 rounded-xl flex items-center justify-center text-xs text-stone-500 border border-stone-200">
          {item.name}
        </div>
      ))}
    </div>
  </div>
);
