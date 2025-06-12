// src/components/TaskCard.tsx
'use client';

import { Task } from '@/utils/api';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export default function TaskCard({ task, onDelete, onDragStart }: TaskCardProps) {
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 cursor-move hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 flex-1">
          {task.title}
        </h4>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 transition-colors ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(task.priority)}`}>
          {task.priority}
        </span>

        {task.due_date && (
          <span className="text-xs text-gray-500">
            Due: {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
}