// Legacy flags remain readable while existing accounts migrate on their next save.
export const roleOf = user => user?.role || (user?.isAdmin ? 'admin' : user?.isDriver ? 'delivery_boy' : 'customer')
export const adminAccess = (user, now = new Date()) => roleOf(user) === 'admin'
  && user.accountActive !== false
  && user.subscription?.status !== 'paused'
  && (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > now)
export const adminQuery = { $or: [{ role: 'admin' }, { role: { $exists: false }, isAdmin: true }] }
export const customerQuery = { $or: [{ role: 'customer' }, { role: { $exists: false }, isAdmin: false, isDriver: { $ne: true } }] }
