'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    weeklyReport: false,
  });

  const [preferences, setPreferences] = useState({
    defaultView: 'kanban',
    autoSave: true,
    showCompletedTasks: false,
    taskSortOrder: 'dueDate',
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your TaskFlow experience and preferences.
          </p>
        </div>

        <div className="space-y-8">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold brand-text">
                Appearance
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Customize the look and feel of your workspace.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium brand-text">
                    Theme
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose between light and dark mode, or use system preference.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle variant="button" showLabel={true} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="bg-white rounded-md p-2 mb-2 border">
                    <div className="h-2 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Light</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="bg-gray-800 rounded-md p-2 mb-2 border border-gray-700">
                    <div className="h-2 bg-gray-600 rounded mb-1"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <span className="text-sm font-medium text-black-900 dark:text-black-100">Dark</span>
                </button>

                <button
                  onClick={() => {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setTheme(prefersDark ? 'dark' : 'light');
                  }}
                  className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex rounded-md mb-2 border">
                    <div className="bg-white p-2 rounded-l-md flex-1">
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded-r-md flex-1">
                      <div className="h-2 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium brand-text">System</span>
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold brand-text">
                Notifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage how and when you receive notifications.
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold brand-text">
                      {key === 'email' && 'Email Notifications'}
                      {key === 'push' && 'Push Notifications'}
                      {key === 'taskReminders' && 'Task Reminders'}
                      {key === 'weeklyReport' && 'Weekly Report'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'push' && 'Receive browser push notifications'}
                      {key === 'taskReminders' && 'Get reminded about upcoming due dates'}
                      {key === 'weeklyReport' && 'Weekly productivity summary'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold brand-text">
                Preferences
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Customize your workflow and task management preferences.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium brand-text">
                  Default View
                </label>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="input-field"
                >
                  <option value="kanban">Kanban Board</option>
                  <option value="list">List View</option>
                  <option value="calendar">Calendar View</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium brand-text">
                  Task Sort Order
                </label>
                <select
                  value={preferences.taskSortOrder}
                  onChange={(e) => handlePreferenceChange('taskSortOrder', e.target.value)}
                  className="input-field"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="created">Date Created</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold brand-text">
                      Auto Save
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically save changes as you work
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('autoSave', !preferences.autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.autoSave ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold brand-text">
                      Show Completed Tasks
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display completed tasks in the main view
                    </p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange('showCompletedTasks', !preferences.showCompletedTasks)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.showCompletedTasks ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.showCompletedTasks ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold brand-text">
                Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account settings and data.
              </p>
            </div>

            <div className="flex space-x-6">
              <button className="btn-secondary">
                Export Data
              </button>
              <button className="btn-secondary">
                Import Data
              </button>
              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors">
                Clear All Data
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="btn-primary"
              onClick={() => {
                alert('Settings saved successfully!');
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}