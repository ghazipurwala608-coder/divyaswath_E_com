import { ArrowUpRight, Boxes, IndianRupee, Mail, ShoppingBag, Sparkles, TrendingUp, UsersRound } from 'lucide-react'
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
            <div className="admin-welcome-content">
              <span className="admin-welcome-tag">
                <Sparkles size={13} />
                Store Performance & Growth
              </span>
              <h2>Good things are growing.</h2>
              <p>Keep your Ayurvedic catalog, customer relations, and daily operations synchronized seamlessly.</p>
              <button className="admin-welcome-btn" onClick={() => navigate('products')}>
                Manage your catalog <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="admin-welcome-art">
              <LeafMark />
              <span>Rooted in Wellness</span>
            </div>
          </div>

          <div className="admin-stats">
            {[
              {
                id: 'revenue',
                title: 'Collected Revenue',
                value: currency(stats.revenue),
                text: 'Paid, non-cancelled orders',
                tab: 'orders',
                icon: IndianRupee,
                badge: 'Live',
                type: 'revenue'
              },
              {
                id: 'orders',
                title: 'Total Orders',
                value: stats.orders || 0,
                text: 'Lifetime orders placed',
                tab: 'orders',
                icon: ShoppingBag,
                badge: 'Orders',
                type: 'orders'
              },
              {
                id: 'products',
                title: 'Active Products',
                value: stats.products || 0,
                text: 'Catalog items in inventory',
                tab: 'products',
                icon: Boxes,
                badge: 'Catalog',
                type: 'products'
              },
              {
                id: 'customers',
                title: 'Store Customers',
                value: stats.users || 0,
                text: 'Registered wellness buyers',
                tab: 'customers',
                icon: UsersRound,
                badge: 'Community',
                type: 'customers'
              }
            ].map(({ id, title, value, text, tab, icon: Icon, type }) => (
              <button key={id} className={`admin-stat-card ${type}`} onClick={() => navigate(tab)}>
                <div className="admin-stat-header">
                  <span className="admin-stat-title">{title}</span>
                  <div className={`admin-stat-icon-wrapper ${type}`}>
                    <Icon size={19} />
                  </div>
                </div>
                <strong className="admin-stat-value">{value}</strong>
                <span className="admin-stat-description">{text}</span>
                <div className="admin-stat-footer">
                  <span>View details</span>
                  <ArrowUpRight size={14} />
                </div>
              </button>
            ))}
          </div>

          <div className="admin-overview-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Revenue Overview</h2>
                  <p>Payments collected across the last 6 months</p>
                </div>
                <Badge tone="green">
                  <span className="admin-live-dot" style={{ width: 6, height: 6, margin: 0 }} /> Live sync
                </Badge>
              </div>
              <RevenueChart sales={monthlySales} />
            </section>

            <OrderBreakdown statuses={data.orderStatuses || []} navigate={navigate} />
          </div>

          <div className="admin-overview-bottom">
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Needs Your Attention</h2>
                  <p>Key operational alerts and tasks</p>
                </div>
              </div>
              <div className="admin-tasks-list">
                <button className="admin-task" onClick={() => navigate('messages')}>
                  <span className="admin-task-icon">
                    <Mail size={19} />
                  </span>
                  <span>
                    <strong>{stats.enquiries || 0} Open Enquiries</strong>
                    <small>Respond to customer questions promptly</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
                <button className="admin-task" onClick={() => navigate('products')}>
                  <span className="admin-task-icon gold">
                    <Boxes size={19} />
                  </span>
                  <span>
                    <strong>{lowStock.length} Low Stock Products</strong>
                    <small>Replenish stock to avoid lost sales</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
                <button className="admin-task" onClick={() => navigate('subscribers')}>
                  <span className="admin-task-icon purple">
                    <UsersRound size={19} />
                  </span>
                  <span>
                    <strong>{stats.subscribers || 0} Subscribers</strong>
                    <small>Engage your wellness newsletter list</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Recent Orders</h2>
                  <p>Latest customer transactions</p>
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
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <button className="admin-order-id-badge" onClick={() => navigate('orders')}>
                              #{order._id.slice(-8).toUpperCase()}
                            </button>
                          </td>
                          <td>
                            <strong>{order.user?.name || order.shippingAddress?.fullName || 'Guest Customer'}</strong>
                          </td>
                          <td>{date(order.createdAt)}</td>
                          <td>
                            <strong style={{ color: 'var(--admin-emerald-deep)' }}>{currency(order.totalPrice)}</strong>
                          </td>
                          <td>
                            <Badge tone={
                              order.orderStatus === 'Delivered' ? 'green' : 
                              order.orderStatus === 'Cancelled' ? 'red' : 
                              order.orderStatus === 'Shipped' ? 'blue' : 'gold'
                            }>
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
                  text="When customers purchase from your store, real-time orders will appear here automatically."
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
    return {
      key,
      label: day.toLocaleDateString('en-US', { month: 'short' }),
      total: Number(sales.find(item => item._id === key)?.total || 0)
    }
  })

  const totalCollected = months.reduce((sum, month) => sum + month.total, 0)
  const max = Math.max(100, ...months.map(month => month.total))

  const width = 600
  const height = 220
  const paddingLeft = 65
  const paddingRight = 30
  const paddingTop = 25
  const paddingBottom = 40
  const usableWidth = width - paddingLeft - paddingRight
  const usableHeight = height - paddingTop - paddingBottom

  const points = months.map((month, index) => {
    const x = paddingLeft + (index / (months.length - 1)) * usableWidth
    const y = paddingTop + usableHeight - (month.total / max) * usableHeight
    return [x, y]
  })

  const linePath = points.reduce((acc, point, index, arr) => {
    if (index === 0) return `M ${point[0]},${point[1]}`
    const prev = arr[index - 1]
    const midX = (prev[0] + point[0]) / 2
    return `${acc} C ${midX},${prev[1]} ${midX},${point[1]} ${point[0]},${point[1]}`
  }, '')

  const lastPoint = points[points.length - 1]
  const firstPoint = points[0]
  const areaPath = `${linePath} L ${lastPoint[0]},${paddingTop + usableHeight} L ${firstPoint[0]},${paddingTop + usableHeight} Z`

  return (
    <div className="admin-revenue-chart">
      <div className="admin-chart-summary">
        <div>
          <small>Total in Last 6 Months</small>
          <strong>{currency(totalCollected)}</strong>
        </div>
        <div className="admin-chart-legend-badge">
          <i />
          <span>Collected Revenue</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Monthly collected revenue: ${months.map(month => `${month.label} ${currency(month.total)}`).join(', ')}`}
      >
        <defs>
          <linearGradient id="admin-revenue-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#14533d" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#14533d" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#14533d" stopOpacity="0.0" />
          </linearGradient>
          <filter id="admin-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#14533d" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Grid lines & Y-axis labels */}
        {[0, 0.5, 1].map(ratio => {
          const y = paddingTop + usableHeight - ratio * usableHeight
          const val = Math.round(max * ratio)
          return (
            <g key={ratio}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                stroke="#e8efe9"
                strokeDasharray="4 6"
                strokeWidth="1"
              />
              <text x={paddingLeft - 10} y={y + 4} textAnchor="end">
                {currency(val)}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#admin-revenue-gradient)" />

        {/* Smooth line */}
        <path
          d={linePath}
          fill="none"
          stroke="#14533d"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#admin-glow)"
        />

        {/* Data points & X-axis labels */}
        {months.map((month, index) => {
          const [x, y] = points[index]
          return (
            <g key={month.key}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="#ffffff"
                stroke="#14533d"
                strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(20,83,61,0.25))' }}
              >
                <title>{`${month.label}: ${currency(month.total)}`}</title>
              </circle>
              <text x={x} y={height - 12} textAnchor="middle">
                {month.label}
              </text>
            </g>
          )
        })}
      </svg>
      {!months.some(month => month.total > 0) && (
        <p className="admin-chart-note">Live order payments will dynamically populate this chart.</p>
      )}
    </div>
  )
}

function OrderBreakdown({ statuses, navigate }) {
  const colors = ['#14533d', '#d97706', '#0d9488', '#2563eb', '#dc2626', '#7c3aed']
  const total = statuses.reduce((sum, item) => sum + item.count, 0)
  let offset = 0

  return (
    <section className="admin-panel admin-order-breakdown">
      <div className="admin-panel-heading">
        <div>
          <h2>Order Distribution</h2>
          <p>Status breakdown of all orders</p>
        </div>
        <Badge>All Time</Badge>
      </div>

      <div className="admin-donut">
        <svg viewBox="0 0 160 160" role="img" aria-label={`${total} orders`}>
          <circle cx="80" cy="80" r="62" fill="none" stroke="#edf3ee" strokeWidth="16" />
          {statuses.map((item, index) => {
            const length = total ? (item.count / total) * 389.56 : 0
            const start = offset
            offset += length
            return (
              <circle
                key={item._id}
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="16"
                strokeDasharray={`${length} ${389.56 - length}`}
                strokeDashoffset={-start}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.4s ease' }}
              />
            )
          })}
        </svg>
        <div>
          <strong>{total}</strong>
          <small>Total Orders</small>
        </div>
      </div>

      <div className="admin-chart-legend">
        {statuses.length ? (
          statuses.map((item, index) => (
            <div key={item._id} className="admin-legend-row">
              <i style={{ background: colors[index % colors.length] }} />
              <span>{item._id}</span>
              <strong>{item.count}</strong>
            </div>
          ))
        ) : (
          <p className="admin-chart-note">No orders placed yet.</p>
        )}
      </div>

      <button className="admin-text-button" onClick={() => navigate('orders')}>
        Manage order pipeline <ArrowUpRight size={14} />
      </button>
    </section>
  )
}

function LeafMark() {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="55" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <path
        d="M60 91V38M60 67C31 66 24 46 28 28c24 0 35 17 32 39ZM60 80c26-1 39-21 33-44-25 3-37 20-33 44Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
