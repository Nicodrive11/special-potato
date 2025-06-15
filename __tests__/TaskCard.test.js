import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskCard from '../src/components/TaskCard'
import '@testing-library/jest-dom'

describe('TaskCard Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test task',
    completed: false,
    priority: 'medium'
  }

  const mockOnToggle = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  // Test 1: Component renders with task title
  test('renders task title as heading', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    const taskTitle = screen.getByRole('heading', { name: 'Test task' })
    expect(taskTitle).toBeInTheDocument()
  })

  // Test 2: Delete button functionality
  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    const deleteButton = screen.getByRole('button')
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  // Test 3: Priority display
  test('displays task priority correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  // Test 4: High priority task
  test('displays high priority task correctly', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' }
    
    render(
      <TaskCard 
        task={highPriorityTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    expect(screen.getByText('high')).toBeInTheDocument()
  })
})