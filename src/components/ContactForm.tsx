import { useState } from 'react'
import { emailService } from '../services/emailService'

export type { EmailPayload } from '../services/emailService'
export { emailService }

interface ContactFormState {
  name: string
  email: string
  message: string
  errors: Partial<Record<'name' | 'email' | 'message', string>>
  status: 'idle' | 'sending' | 'success' | 'error'
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  message: '',
  errors: {},
  status: 'idle',
}

export function ContactForm() {
  const [state, setState] = useState<ContactFormState>(initialState)

  function validate(): Partial<Record<'name' | 'email' | 'message', string>> {
    const errors: Partial<Record<'name' | 'email' | 'message', string>> = {}
    if (!state.name.trim()) errors.name = 'Name is required.'
    if (!state.email.trim()) errors.email = 'Email is required.'
    if (!state.message.trim()) errors.message = 'Message is required.'
    return errors
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors }))
      return
    }

    setState((prev) => ({ ...prev, errors: {}, status: 'sending' }))

    try {
      await emailService.send({
        fromName: state.name,
        fromEmail: state.email,
        message: state.message,
      })
      setState((prev) => ({ ...prev, status: 'success' }))
    } catch {
      setState((prev) => ({ ...prev, status: 'error' }))
    }
  }

  function handleChange(field: 'name' | 'email' | 'message') {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setState((prev) => ({
        ...prev,
        [field]: value,
        errors: { ...prev.errors, [field]: undefined },
      }))
    }
  }

  if (state.status === 'success') {
    return (
      <p data-testid="contact-success" className="contact-form__success">
        Thanks for reaching out! I'll get back to you soon.
      </p>
    )
  }

  return (
    <form
      data-testid="contact-form"
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {state.status === 'error' && (
        <p data-testid="contact-error" className="contact-form__error-banner" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="contact-form__field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          data-testid="contact-name-input"
          type="text"
          value={state.name}
          onChange={handleChange('name')}
          aria-describedby={state.errors.name ? 'contact-name-error' : undefined}
          aria-invalid={!!state.errors.name}
        />
        {state.errors.name && (
          <span
            id="contact-name-error"
            data-testid="contact-name-error"
            className="contact-form__field-error"
            role="alert"
          >
            {state.errors.name}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          data-testid="contact-email-input"
          type="email"
          value={state.email}
          onChange={handleChange('email')}
          aria-describedby={state.errors.email ? 'contact-email-error' : undefined}
          aria-invalid={!!state.errors.email}
        />
        {state.errors.email && (
          <span
            id="contact-email-error"
            data-testid="contact-email-error"
            className="contact-form__field-error"
            role="alert"
          >
            {state.errors.email}
          </span>
        )}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          data-testid="contact-message-input"
          value={state.message}
          onChange={handleChange('message')}
          rows={5}
          aria-describedby={state.errors.message ? 'contact-message-error' : undefined}
          aria-invalid={!!state.errors.message}
        />
        {state.errors.message && (
          <span
            id="contact-message-error"
            data-testid="contact-message-error"
            className="contact-form__field-error"
            role="alert"
          >
            {state.errors.message}
          </span>
        )}
      </div>

      <button
        data-testid="contact-submit"
        type="submit"
        disabled={state.status === 'sending'}
        className="contact-form__submit"
      >
        {state.status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

export default ContactForm
