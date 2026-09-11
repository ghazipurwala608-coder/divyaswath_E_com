export const roleOf = user => user?.role || (user?.isAdmin ? 'admin' : user?.isDriver ? 'delivery_boy' : 'customer')
export const dashboardFor = user => ({ super_admin: '/super-admin', admin: '/admin', delivery_boy: '/delivery' }[roleOf(user)] || '/account')
