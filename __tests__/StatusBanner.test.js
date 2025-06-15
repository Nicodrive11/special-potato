import { render, screen } from '@testing-library/react'
import StatusBanner from '../src/components/StatusBanner'
import '@testing-library/jest-dom'

describe('StatusBanner Component', () => {
  // Test 5: Basic rendering
  test('renders without crashing', () => {
    render(<StatusBanner />)
    // Just check that it renders without error
    expect(document.body).toBeInTheDocument()
  })
})