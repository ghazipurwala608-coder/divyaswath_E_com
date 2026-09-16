import toast from 'react-hot-toast'

export async function copyWithToast(value, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(value)
    toast.success(message)
    return true
  } catch {
    toast.error('Unable to copy. Please select and copy the text manually.')
    return false
  }
}
