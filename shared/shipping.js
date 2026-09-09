export function calculateShipping(subtotal, count, settings) {
  return !count || subtotal >= settings.freeAbove ? 0 : settings.fee
}
