'use client';

import { useState } from 'react';
import apiService from '@/utils/api';

export default function ApiDebugPanel() {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await testFn();
      setResults(prev => prev + `\n✅ ${testName}: ${JSON.stringify(result, null, 2)}\n`);
    } catch (error) {
      setResults(prev => prev + `\n❌ ${testName}: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'GET /api/tasks',
      test: () => apiService.getTasks()
    },
    {
      name: 'GET /api/users', 
      test: () => apiService.getUsers()
    },
    {
      name: 'POST /api/tasks (Create)',
      test: () => apiService.createTask({
        title: 'Test Task from Debug Panel',
        description: 'Testing API connection',
        priority: 'medium',
        task_status: 'pending'
      })
    },
    {
      name: 'PATCH /api/tasks/1 (Update Status)',
      test: () => apiService.updateTask(1, { task_status: 'in-progress' })
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 API Debug Panel</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {tests.map((test, index) => (
          <button
            key={index}
            onClick={() => testEndpoint(test.name, test.test)}
            disabled={loading}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {test.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setResults('')}
          className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          Clear Results
        </button>
        
        <button
          onClick={() => {
            setResults('🧪 Running all tests...\n');
            tests.forEach((test, index) => {
              setTimeout(() => testEndpoint(test.name, test.test), index * 1000);
            });
          }}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Run All Tests
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto whitespace-pre-wrap">
        {results || '🚀 Click a button to test API endpoints...\n\nThis will help debug connection issues!'}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>💡 Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Green ✅ means the endpoint is working correctly</li>
          <li>Red ❌ shows the exact error message from your API</li>
          <li>Use this to identify which fields your API requires</li>
          <li>Check your backend terminal for detailed error logs</li>
        </ul>
      </div>
    </div>
  );
}