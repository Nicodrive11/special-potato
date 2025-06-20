import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskFormModal from '@/components/TaskFormModal'
import '@testing-library/jest-dom'

describe('TaskFormModal Component', () => {
  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    mockOnSubmit.mockClear()
  })

  test('renders modal content when isOpen is true', () => {
    render(
      <TaskFormModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )

    expect(screen.getByText('Add New Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  test('does not render when isOpen is false', () => {
    render(
      <TaskFormModal 
        isOpen={false} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )

    expect(screen.queryByText('Add New Task')).not.toBeInTheDocument()
  })

  test('submits form when filled out correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskFormModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )

    const textInputs = screen.getAllByRole('textbox')
    const titleInput = textInputs[0]
    const prioritySelect = screen.getByRole('combobox')
    const submitButton = screen.getByRole('button', { name: /add task/i })

    await user.type(titleInput, 'New test task')
    await user.selectOptions(prioritySelect, 'high')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TaskFormModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})