import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
export function useNewsletter(source) {
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const subscribe = async event => {
    event.preventDefault()
    if (submitting) return
    const form = event.currentTarget
    const email = form.querySelector('input[type="email"]')?.value
    setSubmitting(true)
    try {
      await apiRequest('/newsletter', { method: 'POST', body: JSON.stringify({ email, consent: true, source }) })
      setSubscribed(true)
      toast.success('Thank you for subscribing')
      form.reset()
    } catch (error) { toast.error(error.message) } finally { setSubmitting(false) }
  }
  return { subscribe, submitting, subscribed }
}
