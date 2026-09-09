import { ArrowUpRight, Boxes, IndianRupee, Mail, ShoppingBag, UsersRound } from 'lucide-react'
import { Badge, currency, DataState, date, EmptyState, useAdminData } from './AdminUI.jsx'

export default function Overview({ navigate }) {
  const { data, loading, error, reload } = useAdminData('/admin/dashboard')

  const stats = data?.stats || {}
  const monthlySales = Array.isArray(data?.monthlySales) ? data.monthlySales : []
  const lowStock = Array.isArray(data?.lowStock) ? data.lowStock : []
  const recentOrders = Array.isArray(data?.recentOrders) ? data.recentOrders : []
  const maxSales = Math.max(1, ...monthlySales.map(item => item?.total || 0))

  return (
    <DataState loading={loading} error={error} retry={reload}>
      {data && (
        <>
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">YOUR STORE, AT A GLANCE</span>
              <h2>A little care. A growing business.</h2>
              <p>Keep your products, customers and everyday operations in sync.</p>
              <button onClick={() => navigate('products')}>
                Manage your catalog <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="admin-welcome-art">
              <LeafMark />
              <span>ROOTED IN WELLNESS</span>
            </div>
          </div>

          <div className="admin-stats">
            {[
              [IndianRupee, 'Collected revenue', currency(stats.revenue), 'Paid, non-cancelled orders', 'overview'],
              [ShoppingBag, 'Total orders', stats.orders || 0, 'Your complete order history', 'orders'],
              [Boxes, 'Products', stats.products || 0, 'Original catalog preserved', 'products'],
              [UsersRound, 'Customers', stats.users || 0, 'Registered store customers', 'customers']
            ].map(([Icon, title, value, text, tab]) => (
              <button key={title} onClick={() => navigate(tab)}>
                <div>
                  <span>{title}</span>
                  <Icon size={20} />
                </div>
                <strong>{value}</strong>
                <small>{text}</small>
              </button>
            ))}
          </div>

          <div className="admin-overview-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Revenue overview</h2>
                  <p>Payments collected over the last six months</p>
                </div>
                <Badge>Live data</Badge>
              </div>
              {monthlySales.length ? (
                <div className="admin-chart">
                  {monthlySales.map(month => (
                    <div key={month._id}>
                      <strong>{currency(month.total)}</strong>
                      <span style={{ height: `${Math.max(8, ((month.total || 0) / maxSales) * 150)}px` }} />
                      <small>{month._id}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Your first sale starts the story"
                  text="Collected payments will appear here once orders are marked paid."
                />
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Needs your attention</h2>
                  <p>A few things to keep moving</p>
                </div>
              </div>
              <button className="admin-task" onClick={() => navigate('messages')}>
                <span className="admin-task-icon">
                  <Mail size={20} />
                </span>
                <span>
                  <strong>{stats.enquiries || 0} open enquiries</strong>
                  <small>Help your customers feel heard</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
              <button className="admin-task" onClick={() => navigate('products')}>
                <span className="admin-task-icon gold">
                  <Boxes size={20} />
                </span>
                <span>
                  <strong>{lowStock.length} products low on stock</strong>
                  <small>Review inventory and availability</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
              <button className="admin-task" onClick={() => navigate('subscribers')}>
                <span className="admin-task-icon">
                  <UsersRound size={20} />
                </span>
                <span>
                  <strong>{stats.subscribers || 0} subscribers</strong>
                  <small>Your wellness community</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            </section>
          </div>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Recent orders</h2>
                <p>The latest from your store</p>
              </div>
              <button className="admin-text-button" onClick={() => navigate('orders')}>
                View all orders <ArrowUpRight size={15} />
              </button>
            </div>
            {recentOrders.length ? (
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>
                          <button className="admin-text-button" onClick={() => navigate('orders')}>
                            #{order._id.slice(-8).toUpperCase()}
                          </button>
                        </td>
                        <td>{order.user?.name || order.shippingAddress?.fullName || 'Customer'}</td>
                        <td>{date(order.createdAt)}</td>
                        <td>{currency(order.totalPrice)}</td>
                        <td>
                          <Badge tone={order.orderStatus === 'Delivered' ? 'green' : 'gold'}>
                            {order.orderStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No orders yet"
                text="Orders placed on your website will appear here automatically."
              />
            )}
          </section>
        </>
      )}
    </DataState>
  )
}

function LeafMark() {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeOpacity=".35" />
      <path
        d="M60 91V38M60 67C31 66 24 46 28 28c24 0 35 17 32 39ZM60 80c26-1 39-21 33-44-25 3-37 20-33 44Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

