// Feature: 3d-portfolio-website, Property 9: Contact form shows an error for every empty required field

import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import { ContactForm } from './ContactForm'
import * as emailService from '../services/emailService'

vi.mock('../services/emailService', () => ({
  emailService: {
    send: vi.fn(),
  },
}))

const mockSend = vi.mocked(emailService.emailService.send)

const VALID_VALUES: Record<string, string> = {
  name: 'Alice',
  email: 'alice@example.com',
  message: 'Hello there!',
}

const INPUT_TEST_IDS: Record<string, string> = {
  name: 'contact-name-input',
  email: 'contact-email-input',
  message: 'contact-message-input',
}

const ERROR_TEST_IDS: Record<string, string> = {
  name: 'contact-name-error',
  email: 'contact-email-error',
  message: 'contact-message-error',
}

const ALL_FIELDS = ['name', 'email', 'message'] as const
type Field = (typeof ALL_FIELDS)[number]

beforeEach(() => {
  vi.clearAllMocks()
  mockSend.mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()
})

/**
 * Validates: Requirements 7.5
 *
 * Property 9: Contact form shows an error for every empty required field.
 * For any non-empty subset of {name, email, message} left empty on submit,
 * each empty field must have a corresponding inline error element, non-empty
 * fields must NOT have an error element, and the form must remain in the DOM.
 */
describe('Property 9: Contact form shows an error for every empty required field', () => {
  it('shows inline errors for every empty field in any non-empty subset', async () => {
    // Use delay:null to skip artificial keystroke delays, keeping 100 runs fast
    const user = userEvent.setup({ delay: null })

    await fc.assert(
      fc.asyncProperty(
        fc.subarray(['name', 'email', 'message'] as const, { minLength: 1 }),
        async (emptyFields: readonly Field[]) => {
          render(<ContactForm />)

          const filledFields = ALL_FIELDS.filter((f) => !emptyFields.includes(f))

          // Fill in the non-empty fields with valid values
          for (const field of filledFields) {
            await user.type(
              screen.getByTestId(INPUT_TEST_IDS[field]),
              VALID_VALUES[field],
            )
          }

          // Submit the form
          fireEvent.submit(screen.getByTestId('contact-form'))

          // Assert each empty field has a corresponding error element
          for (const field of emptyFields) {
            expect(
              screen.queryByTestId(ERROR_TEST_IDS[field]),
              `Expected error for empty field "${field}"`,
            ).not.toBeNull()
          }

          // Assert non-empty fields do NOT have error elements
          for (const field of filledFields) {
            expect(
              screen.queryByTestId(ERROR_TEST_IDS[field]),
              `Expected no error for filled field "${field}"`,
            ).toBeNull()
          }

          // Assert the form is still in the DOM (no page reload / replacement)
          expect(screen.getByTestId('contact-form')).toBeInTheDocument()

          cleanup()
        },
      ),
      { numRuns: 100 },
    )
  }, 30000)
})
