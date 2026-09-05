export const ORDER_FLOW = [
  { status: 'Processing', label: 'Order placed', shortLabel: 'Placed', description: 'Order received by us.', nextMessage: 'We will verify and confirm your order shortly.', adminAction: 'Confirm order' },
  { status: 'Confirmed', label: 'Order confirmed', shortLabel: 'Confirmed', description: 'Order checked and approved.', nextMessage: 'Your items will now be packed securely.', adminAction: 'Mark packed' },
  { status: 'Packed', label: 'Ready to dispatch', shortLabel: 'Packed', description: 'Items securely packed.', nextMessage: 'It will be handed to the delivery partner next.', adminAction: 'Dispatch order' },
  { status: 'Shipped', label: 'Shipped', shortLabel: 'Shipped', description: 'Handed to delivery partner.', nextMessage: 'The next update will appear when it reaches your local delivery team.', adminAction: 'Out for delivery' },
  { status: 'Out for Delivery', label: 'Out for delivery', shortLabel: 'Out for delivery', description: 'With your local delivery agent.', nextMessage: 'Please keep your phone available for the delivery call.', adminAction: 'Mark delivered' },
  { status: 'Delivered', label: 'Delivered', shortLabel: 'Delivered', description: 'Package reached your address.', nextMessage: 'Thank you for choosing Divya Swasth.', adminAction: null },
]

export const ORDER_FILTERS = ['All', 'Active', 'Delivered', 'Cancelled']
export const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refund Pending', 'Refunded']

export const NEXT_ORDER_STATUS = Object.fromEntries(ORDER_FLOW.slice(0, -1).map((step, index) => [step.status, ORDER_FLOW[index + 1].status]))

export function orderStepIndex(status) {
  return ORDER_FLOW.findIndex((step) => step.status === status)
}

export function statusTone(status) {
  return {
    Processing: 'bg-[#fff3d7] text-[#946516] border-[#eed59c]',
    Confirmed: 'bg-[#edf4e8] text-[#4b704f] border-[#cfe0ca]',
    Packed: 'bg-[#eee9f8] text-[#66518d] border-[#d8ccec]',
    Shipped: 'bg-[#e7f0f4] text-[#3f6978] border-[#c9dce4]',
    'Out for Delivery': 'bg-[#e7eef9] text-[#416292] border-[#cbd8ec]',
    Delivered: 'bg-[#e5f3e7] text-[#327040] border-[#c8e2cc]',
    Cancelled: 'bg-[#f8e8e5] text-[#93483e] border-[#edcbc6]',
  }[status] || 'bg-[#edf0eb] text-[#647168] border-[#dbe0d9]'
}

export function formatOrderDate(value, options = {}) {
  if (!value) return 'Not available'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...options })
}
