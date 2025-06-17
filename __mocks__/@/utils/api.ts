// __mocks__/@/utils/api.ts

export interface Task {
  id: number;
  title: string;
  description?: string;
  task_status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_date: string;
  updated_date?: string;
  assigned_to?: string;
  tags?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page?: number;
  limit?: number;
}

// Mock data using your Task interface
export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Setup Development Environment',
    description: 'Configure development tools and dependencies',
    task_status: 'completed',
    priority: 'high',
    due_date: '2025-06-10',
    created_date: '2025-06-01'
  },
  {
    id: 2,
    title: 'Design Database Schema',
    description: 'Create tables and relationships for the application',
    task_status: 'in-progress',
    priority: 'high',
    due_date: '2025-06-20',
    created_date: '2025-06-05'
  },
  {
    id: 3,
    title: 'Implement Authentication',
    description: 'Add user login and registration functionality',
    task_status: 'pending',
    priority: 'medium',
    due_date: '2025-06-25',
    created_date: '2025-06-08'
  }
];

export const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
];

// Mock the legacy fetchTasks function
export const fetchTasks = jest.fn(() => 
  Promise.resolve({
    tasks: mockTasks,
    apiStatus: '✅ Connected to sample data API (mock)'
  })
);

// Mock the ApiService class
const mockApiService = {
  getTasks: jest.fn(() => Promise.resolve({ 
    tasks: mockTasks, 
    total: mockTasks.length 
  })),
  
  getTask: jest.fn((id: number) => 
    Promise.resolve(mockTasks.find(task => task.id === id) || null)
  ),
  
  createTask: jest.fn((task: Omit<Task, 'id' | 'created_date'>) => 
    Promise.resolve({
      ...task,
      id: Date.now(),
      created_date: new Date().toISOString()
    } as Task)
  ),
  
  updateTask: jest.fn((id: number, updates: Partial<Task>) => {
    const existingTask = mockTasks.find(task => task.id === id);
    return Promise.resolve({
      ...existingTask,
      ...updates,
      updated_date: new Date().toISOString()
    } as Task);
  }),
  
  deleteTask: jest.fn(() => Promise.resolve(true)),
  
  getUsers: jest.fn(() => Promise.resolve({ users: mockUsers })),
  
  createUser: jest.fn((user: Omit<User, 'id'>) => 
    Promise.resolve({ ...user, id: Date.now() } as User)
  ),
  
  updateUser: jest.fn((id: number, user: Partial<User>) => 
    Promise.resolve({ id, ...user } as User)
  ),
  
  deleteUser: jest.fn(() => Promise.resolve()),
};

export default mockApiService;