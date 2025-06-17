// __tests__/ApiService.test.tsx (This one is already passing - keep it as is)
import apiService, { fetchTasks } from '@/utils/api'
import '@testing-library/jest-dom'

describe('API Service', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    jest.clearAllMocks()
  })

  // Test 1: fetchTasks function
  test('fetchTasks returns sample data with correct structure', async () => {
    const result = await fetchTasks()
    
    expect(result.tasks).toBeDefined()
    expect(Array.isArray(result.tasks)).toBe(true)
    expect(result.apiStatus).toBeDefined()
    expect(typeof result.apiStatus).toBe('string')
    
    if (result.tasks.length > 0) {
      expect(result.tasks[0]).toHaveProperty('id')
      expect(result.tasks[0]).toHaveProperty('title')
      expect(result.tasks[0]).toHaveProperty('task_status')
      expect(result.tasks[0]).toHaveProperty('priority')
    }
  })

  // Test 2: getTasks method
  test('apiService.getTasks returns tasks with total count', async () => {
    const result = await apiService.getTasks()
    
    expect(result.tasks).toBeDefined()
    expect(result.total).toBeDefined()
    expect(Array.isArray(result.tasks)).toBe(true)
    expect(typeof result.total).toBe('number')
  })

  // Test 3: getTask method
  test('apiService.getTask returns specific task or null', async () => {
    const task = await apiService.getTask(1)
    
    if (task) {
      expect(task).toHaveProperty('id')
      expect(task).toHaveProperty('title')
      expect(task).toHaveProperty('task_status')
    }
    // If null, that's also valid behavior
  })

  // Test 4: createTask method
  test('apiService.createTask creates new task with required fields', async () => {
    const newTaskData = {
      title: 'Test Task',
      description: 'Test Description',
      task_status: 'pending' as const,
      priority: 'medium' as const
    }

    const createdTask = await apiService.createTask(newTaskData)
    
    expect(createdTask.title).toBe('Test Task')
    expect(createdTask.id).toBeDefined()
    expect(createdTask.created_date).toBeDefined()
  })

  // Test 5: deleteTask method
  test('apiService.deleteTask returns boolean result', async () => {
    const result = await apiService.deleteTask(1)
    expect(typeof result).toBe('boolean')
  })
})