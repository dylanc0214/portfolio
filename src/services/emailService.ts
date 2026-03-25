export interface EmailPayload {
  fromName: string
  fromEmail: string
  message: string
  time: string
}

/**
 * Sends an email via EmailJS.
 * Replace SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY with your EmailJS credentials.
 */
export async function send(payload: EmailPayload): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'YOUR_SERVICE_ID'
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'YOUR_TEMPLATE_ID'
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'YOUR_PUBLIC_KEY'

  const { default: emailjs } = await import('@emailjs/browser')

  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: payload.fromName,
      from_email: payload.fromEmail,
      message: payload.message,
      time: payload.time,
    },
    publicKey,
  )
}

export const emailService = { send }
