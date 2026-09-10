import { ArrowUpRight, Boxes, IndianRupee, Mail, ShoppingBag, UsersRound } from 'lucide-react'
import { Badge, currency, DataState, date, EmptyState, useAdminData } from './AdminUI.jsx'

export default function Overview({ navigate }) {
  const { data, loading, error, reload } = useAdminData('/admin/dashboard')

  const stats = data?.stats || {}
  const monthlySales = Array.isArray(data?.monthlySales) ? data.monthlySales : []
  const lowStock = Array.isArray(data?.lowStock) ? data.lowStock : []
  const recentOrders = Array.isArray(data?.recentOrders) ? data.recentOrders : []

  return (
    <DataState loading={loading} error={error} retry={reload}>
      {data && (
        <>
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">YOUR STORE, AT A GLANCE</span>
              <h2>Good things are growing.</h2>
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
                <span className="admin-stat-link">View details <ArrowUpRight size={14} /></span>
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
              <RevenueChart sales={monthlySales} />
            </section>

            <OrderBreakdown statuses={data.orderStatuses || []} navigate={navigate} />
          </div>

          <div className="admin-overview-bottom">
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
          </div>
        </>
      )}
    </DataState>
  )
}

function RevenueChart({ sales }) {
  const months = Array.from({ length: 6 }, (_, index) => {
    const day = new Date()
    day.setDate(1)
    day.setMonth(day.getMonth() - 5 + index)
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}`
    return { key, label: day.toLocaleDateString('en', { month: 'short' }), total: Number(sales.find(item => item._id === key)?.total || 0) }
  })
  const max = Math.max(100, ...months.map(month => month.total))
  const points = months.map((month, index) => [60 + index * 100, 185 - month.total / max * 145])
  const line = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ')
  return <div className="admin-revenue-chart">
    <div className="admin-chart-summary"><div><small>Collected in displayed months</small><strong>{currency(months.reduce((sum, month) => sum + month.total, 0))}</strong></div><span><i /> Collected revenue</span></div>
    <svg viewBox="0 0 600 225" role="img" aria-label={`Monthly collected revenue: ${months.map(month => `${month.label} ${currency(month.total)}`).join(', ')}`}>
      <defs><linearGradient id="admin-revenue-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#4b7250" stopOpacity=".3" /><stop offset="1" stopColor="#4b7250" stopOpacity=".015" /></linearGradient></defs>
      {[0, .5, 1].map(ratio => <g key={ratio}><line x1="60" x2="560" y1={185 - ratio * 145} y2={185 - ratio * 145} stroke="#e5e9e2" strokeDasharray="4 5" /><text x="0" y={189 - ratio * 145}>{currency(Math.round(max * ratio))}</text></g>)}
      <path d={`${line} L560,185 L60,185 Z`} fill="url(#admin-revenue-fill)" /><path d={line} fill="none" stroke="#4b7250" strokeWidth="3" strokeLinejoin="round" />
      {months.map((month, index) => <g key={month.key}><circle cx={points[index][0]} cy={points[index][1]} r="5" fill="white" stroke="#4b7250" strokeWidth="2"><title>{month.label}: {currency(month.total)}</title></circle><text x={points[index][0]} y="215" textAnchor="middle">{month.label}</text></g>)}
    </svg>
    {!months.some(month => month.total) && <p className="admin-chart-note">Your paid orders will bring this chart to life.</p>}
  </div>
}

function OrderBreakdown({ statuses, navigate }) {
  const colors = ['#4b7250', '#d4a53b', '#94a780', '#b88a56', '#b96f60', '#75867a']
  const total = statuses.reduce((sum, item) => sum + item.count, 0)
  let offset = 0
  return <section className="admin-panel admin-order-breakdown"><div className="admin-panel-heading"><div><h2>Order overview</h2><p>Every order, at a glance</p></div><Badge>All time</Badge></div>
    <div className="admin-donut"><svg viewBox="0 0 160 160" role="img" aria-label={`${total} orders. ${statuses.map(item => `${item._id}: ${item.count}`).join(', ')}`}><circle cx="80" cy="80" r="62" fill="none" stroke="#edf2e9" strokeWidth="15" />{statuses.map((item, index) => {
      const length = total ? item.count / total * 389.56 : 0
      const start = offset
      offset += length
      return <circle key={item._id} cx="80" cy="80" r="62" fill="none" stroke={colors[index % colors.length]} strokeWidth="15" strokeDasharray={`${length} ${389.56 - length}`} strokeDashoffset={-start} transform="rotate(-90 80 80)" />
    })}</svg><div><strong>{total}</strong><small>Total orders</small></div></div>
    <div className="admin-chart-legend">{statuses.length ? statuses.map((item, index) => <div key={item._id}><i style={{ background: colors[index % colors.length] }} /><span>{item._id}</span><strong>{item.count}</strong></div>) : <p>No orders yet</p>}</div>
    <button className="admin-text-button" onClick={() => navigate('orders')}>Manage orders <ArrowUpRight size={14} /></button>
  </section>
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
