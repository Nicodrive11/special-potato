'use client';

interface InsightCardProps {
  emoji: string;
  title: string;
  description: string;
  colorClass: string;
}

export default function InsightCard({ emoji, title, description, colorClass }: InsightCardProps) {
  return (
    <div className={`rounded-lg p-6 ${colorClass} transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-start space-x-4">
        <div className="text-3xl">{emoji}</div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h4>
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}