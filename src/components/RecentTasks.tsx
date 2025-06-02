// src/components/RecentTasks.tsx
import Link from 'next/link';
import { getPriorityColor, getStatusColor } from '@/utils/ui';
import { Task } from '@/utils/api';

interface RecentTasksProps {
  tasks: Task[];
  loading: boolean;
}

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        {task.dueDate && (
          <p className="text-sm text-gray-500 mt-1">Due: {task.dueDate}</p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
}

export default function RecentTasks({ tasks, loading }: RecentTasksProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          <Link href="/tasks" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}