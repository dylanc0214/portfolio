import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactForm } from './ContactForm'
import * as emailService from '../services/emailService'

vi.mock('../services/emailService', () => ({
  emailService: {
    send: vi.fn(),
  },
}))

const mockSend = vi.mocked(emailService.emailService.send)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ContactForm — inline validation errors', () => {
  it('shows name error when only name is empty on submit', async () => {
    render(<ContactForm />)

    await userEvent.type(screen.getByTestId('contact-email-input'), 'test@example.com')
    await userEvent.type(screen.getByTestId('contact-message-input'), 'Hello there')
    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(screen.getByTestId('contact-name-error')).toBeInTheDocument()
    expect(screen.queryByTestId('contact-email-error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('contact-message-error')).not.toBeInTheDocument()
  })

  it('shows email error when only email is empty on submit', async () => {
    render(<ContactForm />)

    await userEvent.type(screen.getByTestId('contact-name-input'), 'Alice')
    await userEvent.type(screen.getByTestId('contact-message-input'), 'Hello there')
    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(screen.queryByTestId('contact-name-error')).not.toBeInTheDocument()
    expect(screen.getByTestId('contact-email-error')).toBeInTheDocument()
    expect(screen.queryByTestId('contact-message-error')).not.toBeInTheDocument()
  })

  it('shows message error when only message is empty on submit', async () => {
    render(<ContactForm />)

    await userEvent.type(screen.getByTestId('contact-name-input'), 'Alice')
    await userEvent.type(screen.getByTestId('contact-email-input'), 'alice@example.com')
    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(screen.queryByTestId('contact-name-error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('contact-email-error')).not.toBeInTheDocument()
    expect(screen.getByTestId('contact-message-error')).toBeInTheDocument()
  })

  it('shows all three errors when all fields are empty on submit', () => {
    render(<ContactForm />)

    fireEvent.submit(screen.getByTestId('contact-form'))

    expect(screen.getByTestId('contact-name-error')).toBeInTheDocument()
    expect(screen.getByTestId('contact-email-error')).toBeInTheDocument()
    expect(screen.getByTestId('contact-message-error')).toBeInTheDocument()
  })

  it('does not reload the page on submit (e.preventDefault is called)', () => {
    render(<ContactForm />)

    const form = screen.getByTestId('contact-form')
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault')

    form.dispatchEvent(submitEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})

describe('ContactForm — success state', () => {
  it('shows success message after successful submission', async () => {
    mockSend.mockResolvedValueOnce(undefined)
    render(<ContactForm />)

    await userEvent.type(screen.getByTestId('contact-name-input'), 'Alice')
    await userEvent.type(screen.getByTestId('contact-email-input'), 'alice@example.com')
    await userEvent.type(screen.getByTestId('contact-message-input'), 'Hello!')
    fireEvent.submit(screen.getByTestId('contact-form'))

    await waitFor(() => {
      expect(screen.getByTestId('contact-success')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })
})

describe('ContactForm — network error state', () => {
  it('shows error banner after network failure and preserves all field values', async () => {
    mockSend.mockRejectedValueOnce(new Error('Network error'))
    render(<ContactForm />)

    await userEvent.type(screen.getByTestId('contact-name-input'), 'Alice')
    await userEvent.type(screen.getByTestId('contact-email-input'), 'alice@example.com')
    await userEvent.type(screen.getByTestId('contact-message-input'), 'Hello!')
    fireEvent.submit(screen.getByTestId('contact-form'))

    await waitFor(() => {
      expect(screen.getByTestId('contact-error')).toBeInTheDocument()
    })

    // Field values are preserved
    expect(screen.getByTestId('contact-name-input')).toHaveValue('Alice')
    expect(screen.getByTestId('contact-email-input')).toHaveValue('alice@example.com')
    expect(screen.getByTestId('contact-message-input')).toHaveValue('Hello!')
  })
})
