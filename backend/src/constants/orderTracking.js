export const ORDER_FLOW = ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
export const ORDER_STATUSES = [...ORDER_FLOW, 'Cancelled']
export const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refund Pending', 'Refunded']

export const NEXT_ORDER_STATUS = {
  Processing: 'Confirmed',
  Confirmed: 'Packed',
  Packed: 'Shipped',
  Shipped: 'Out for Delivery',
  'Out for Delivery': 'Delivered',
}

export function trackingEventFor(status, { courierName = '', note = '', location = '' } = {}) {
  const defaults = {
    Processing: ['Order placed', 'We have received your order and will confirm it shortly.'],
    Confirmed: ['Order confirmed', 'Your order has been confirmed and is being prepared.'],
    Packed: ['Order packed', 'Your items are packed and ready for dispatch.'],
    Shipped: ['Order shipped', courierName ? `Your package has been handed to ${courierName}.` : 'Your package has left our facility.'],
    'Out for Delivery': ['Out for delivery', 'Your package is with the delivery partner and should arrive soon.'],
    Delivered: ['Order delivered', 'Your order has been delivered successfully.'],
    Cancelled: ['Order cancelled', 'This order has been cancelled.'],
  }
  const [title, message] = defaults[status]
  return { status, title, message: note || message, location, timestamp: new Date() }
}
