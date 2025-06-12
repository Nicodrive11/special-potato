// src/components/InsightCard.tsx
'use client';

interface InsightCardProps {
  emoji: string;
  title: string;
  description: string;
  colorClass: string;
}

export default function InsightCard({ emoji, title, description, colorClass }: InsightCardProps) {
  return (
    <div className={`text-center p-4 rounded-lg ${colorClass}`}>
      <div className="text-2xl mb-2">{emoji}</div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
}