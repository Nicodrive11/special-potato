// src/components/KanbanColumn.tsx
'use client';

import { Task } from '@/utils/api';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onDrop: (e: React.DragEvent, targetStatus: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDeleteTask: (taskId: number) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export default function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onDrop,
  onDragOver,
  onDeleteTask,
  onDragStart
}: KanbanColumnProps) {
  return (
    <div
      className={`${color} rounded-lg p-4 min-h-96`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>
        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
          />
        ))}

        {tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Drag tasks here or create new ones"
          />
        )}
      </div>
    </div>
  );
}