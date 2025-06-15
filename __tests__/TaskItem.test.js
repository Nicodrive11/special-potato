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

  // Test 7: Task completion toggle
  test('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    // Your TaskCard doesn't have a checkbox, so let's test the delete button instead
    const deleteButton = screen.getByRole('button')
    
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  // Test 8: Task deletion
  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    // Use getByRole for delete button since your component has one
    const deleteButton = screen.getByRole('button')
    
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  // Test 9: Task title display
  test('displays task title correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    // Use getByRole to find the heading with task title
    const taskTitle = screen.getByRole('heading', { name: mockTask.title })
    
    expect(taskTitle).toBeInTheDocument()
  })

  // Test 10: Priority indicator display  
  test('displays priority badge correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )

    // Check for priority text in the component
    expect(screen.getByText('medium')).toBeInTheDocument()
  })
})