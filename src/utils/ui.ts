export function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 'priority-urgent';
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'status-completed';
    case 'in-progress':
      return 'status-in-progress';
    case 'pending':
      return 'status-pending';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export function isOverdue(dueDate: string | Date): boolean {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  return dateObj < now;
}

export function getDaysUntilDue(dueDate: string | Date): number {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffInMilliseconds = dateObj.getTime() - now.getTime();
  return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
}