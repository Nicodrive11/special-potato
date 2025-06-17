'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'
import apiService, { User } from '@/utils/api';

interface UserListProps {
  compact?: boolean;
}

export default function UserList({ compact = false }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers();
      setUsers(response.users || []);
      setError('');
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users from API');
      
      // Fallback to sample users
      const sampleUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@taskflow.com',
          role: 'admin',
          created_date: '2025-01-15',
          task_statistics: {
            total_tasks: 12,
            completed_tasks: 8,
            in_progress_tasks: 3,
            pending_tasks: 1
          }
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@taskflow.com',
          role: 'manager',
          created_date: '2025-02-01',
          task_statistics: {
            total_tasks: 8,
            completed_tasks: 5,
            in_progress_tasks: 2,
            pending_tasks: 1
          }
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@taskflow.com',
          role: 'user',
          created_date: '2025-03-10',
          task_statistics: {
            total_tasks: 6,
            completed_tasks: 4,
            in_progress_tasks: 1,
            pending_tasks: 1
          }
        }
      ];
      setUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
        <p className="text-sm">No users found</p>
        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
          {error} - Showing sample data
        </div>
      )}
      
      {users.map((user) => (
        <div
          key={user.id}
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${
            compact ? 'border-gray-100' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name}
                  width={compact ? 32 : 48}
                  height={compact ? 32 : 48}
                  className={`rounded-full object-cover ${compact ? 'w-8 h-8' : 'w-12 h-12'}`}
                />
              ) : (
                <div className={`${compact ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm'} rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold`}>
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} text-gray-900 truncate`}>
                  {user.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || 'user')}`}>
                  {user.role || 'user'}
                </span>
              </div>
              
              <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} truncate`}>
                {user.email}
              </p>
              
              {!compact && (
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Joined: {formatDate(user.created_date)}</span>
                  {user.updated_date && (
                    <span>Updated: {formatDate(user.updated_date)}</span>
                  )}
                </div>
              )}
            </div>

            {/* Task Statistics */}
            {user.task_statistics && !compact && (
              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-lg font-bold text-blue-600">
                      {user.task_statistics.total_tasks}
                    </div>
                    <div className="text-xs text-blue-600">Total</div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-lg font-bold text-green-600">
                      {user.task_statistics.completed_tasks}
                    </div>
                    <div className="text-xs text-green-600">Done</div>
                  </div>
                  <div className="bg-yellow-50 rounded p-2">
                    <div className="text-lg font-bold text-yellow-600">
                      {user.task_statistics.in_progress_tasks}
                    </div>
                    <div className="text-xs text-yellow-600">Active</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-lg font-bold text-gray-600">
                      {user.task_statistics.pending_tasks}
                    </div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                </div>
              </div>
            )}
            
            {user.task_statistics && compact && (
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {user.task_statistics.completed_tasks}/{user.task_statistics.total_tasks}
                </div>
                <div className="text-xs text-gray-500">tasks done</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}