import fs from 'node:fs'
const file = 'frontend/src/pages/AdminDashboard.jsx'
let source = fs.readFileSync(file, 'utf8')
const helpers = source.slice(source.indexOf('function FulfilmentCard'))
const imports = source.slice(0, source.indexOf('export default function'))
const component = `export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')
  const [filter, setFilter] = useState('Active')
  const load = async () => {
    setLoading(true); setError('')
    try { const data = await apiRequest('/orders/admin/all'); setOrders(data.orders) }
    catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  const filteredOrders = useMemo(() => orders.filter(order => filter === 'All' || (filter === 'Active' ? !['Delivered', 'Cancelled'].includes(order.orderStatus) : order.orderStatus === filter)), [filter, orders])
  const updateOrder = async (id, payload) => {
    setSavingId(id)
    try {
      const { order: updated } = await apiRequest('/orders/' + id + '/status', { method: 'PUT', body: JSON.stringify(payload) })
      setOrders(current => current.map(order => order._id === id ? { ...updated, user: order.user } : order))
      window.dispatchEvent(new Event('products-updated'))
      toast.success('Order updated')
      return true
    } catch (err) { toast.error(err.message); return false } finally { setSavingId('') }
  }
  return <section className="admin-orders"><div className="admin-toolbar"><div className="admin-order-filters">{ORDER_FILTERS.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><button className="admin-button secondary" onClick={load}><RefreshCcw size={15} />Refresh</button></div>{error ? <div className="admin-state" role="alert"><p>{error}</p><button className="admin-button" onClick={load}>Try again</button></div> : loading ? <div className="admin-state"><LoaderCircle className="animate-spin" />Loading orders…</div> : filteredOrders.length ? <div className="admin-order-list">{filteredOrders.map(order => <FulfilmentCard key={order._id} order={order} saving={savingId === order._id} onUpdate={updateOrder} />)}</div> : <div className="admin-panel admin-state"><PackageCheck /><h2>No matching orders</h2><p>Orders matching this filter will appear here.</p></div>}</section>
}

`
fs.writeFileSync('frontend/src/admin/OrderManagement.jsx', imports.replace('  Boxes,\n', '').replace('  ShoppingCart,\n', '').replace('  UsersRound,\n', '') + component + helpers)
fs.writeFileSync(file, "export { default } from '../admin/AdminShell.jsx'\n")
let app = fs.readFileSync('frontend/src/App.jsx', 'utf8').replace("import { Route, Routes }", "import { Route, Routes, useLocation }")
app = app.replace('function App() {', "function App() {\n  const isAdmin = useLocation().pathname === '/admin'").replace('<Header />', '{!isAdmin && <Header />}').replace('<Footer />', '{!isAdmin && <Footer />}')
fs.writeFileSync('frontend/src/App.jsx', app)
