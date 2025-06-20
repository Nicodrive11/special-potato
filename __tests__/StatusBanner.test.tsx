import React from 'react'
import { render } from '@testing-library/react'
import StatusBanner from '@/components/StatusBanner'
import '@testing-library/jest-dom'

describe('StatusBanner Component', () => {
  test('renders status banner component without crashing', () => {
    const { container } = render(<StatusBanner />)
    
    expect(container).toBeInTheDocument()
  })

  test('component imports and mounts successfully', () => {
    expect(() => {
      render(<StatusBanner />)
    }).not.toThrow()
  })
})