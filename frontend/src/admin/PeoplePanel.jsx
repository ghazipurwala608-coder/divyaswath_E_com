import { Eye, Search } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { Badge, currency, DataState, date, EmptyState, Modal, useAdminData } from './AdminUI.jsx'

export default function PeoplePanel({ type }) {
  const { data, setData, loading, error, reload } = useAdminData(`/admin/${type}`)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState('')
  const [detail, setDetail] = useState(null)
  const rows = (data?.[type] || []).filter(item => `${item.name || ''} ${item.email} ${item.subject || ''} ${item.status || ''}`.toLowerCase().includes(query.toLowerCase()))
  const update = async (id, status) => {
    setBusy(id)
    try {
      const result = await apiRequest(`/admin/${type}/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      const updated = result.message || result.subscriber
      setData(current => ({ ...current, [type]: current[type].map(item => item._id === id ? updated : item) }))
      if (detail?._id === id) setDetail(updated)
      toast.success('Status updated')
    } catch (err) { toast.error(err.message) } finally { setBusy('') }
  }
  const viewCustomer = async id => {
    setBusy(id)
    try { setDetail(await apiRequest(`/admin/customers/${id}`)) } catch (err) { toast.error(err.message) } finally { setBusy('') }
  }
  const titles = { customers: ['Your customers', 'People who have registered with your store'], messages: ['Customer enquiries', 'Track and resolve messages from your website'], subscribers: ['Newsletter community', 'Email subscriptions with recorded consent'] }
  return <><div className="admin-toolbar"><label className="admin-search"><Search size={17} /><input placeholder={`Search ${type}…`} value={query} onChange={event => setQuery(event.target.value)} /></label></div><DataState loading={loading} error={error} retry={reload}><section className="admin-panel"><div className="admin-panel-heading"><div><h2>{titles[type][0]}</h2><p>{titles[type][1]}</p></div><Badge>{rows.length} records</Badge></div>{rows.length ? <div className="admin-table-wrap"><table><thead><tr>{(type === 'customers' ? ['Customer', 'Phone', 'Orders', 'Order value', 'Joined', ''] : type === 'messages' ? ['Customer', 'Subject', 'Received', 'Status', ''] : ['Email', 'Source', 'Consent recorded', 'Status', '']).map((title, index) => <th key={index}>{title}</th>)}</tr></thead><tbody>{rows.map(item => <tr key={item._id}>{type === 'customers' ? <><td><strong>{item.name}</strong><small className="admin-block">{item.email}</small></td><td>{item.phone}</td><td>{item.orders}</td><td>{currency(item.spent)}</td><td>{date(item.createdAt)}</td><td><button className="admin-icon-button" aria-label={`View ${item.name}`} disabled={busy === item._id} onClick={() => viewCustomer(item._id)}><Eye size={17} /></button></td></> : type === 'messages' ? <><td><strong>{item.name}</strong><small className="admin-block">{item.email}</small></td><td>{item.subject}</td><td>{date(item.createdAt)}</td><td><select aria-label={`Status for ${item.subject}`} disabled={busy === item._id} value={item.status} onChange={event => update(item._id, event.target.value)}>{['New', 'In progress', 'Resolved'].map(status => <option key={status}>{status}</option>)}</select></td><td><button className="admin-icon-button" aria-label="Read enquiry" onClick={() => setDetail(item)}><Eye size={17} /></button></td></> : <><td>{item.email}</td><td>{item.source}</td><td>{date(item.consentAt)}</td><td><Badge tone={item.status === 'Subscribed' ? 'green' : ''}>{item.status}</Badge></td><td>{item.status === 'Subscribed' && <button className="admin-text-button" disabled={busy === item._id} onClick={() => update(item._id, 'Unsubscribed')}>Unsubscribe</button>}</td></>}</tr>)}</tbody></table></div> : <EmptyState title={`No ${type} found`} text={query ? 'Try another search.' : 'New website activity will appear here automatically.'} />}</section></DataState>{detail && <Modal title={type === 'customers' ? detail.customer.name : detail.subject} onClose={() => setDetail(null)}><div className="admin-modal-body">{type === 'customers' ? <><p>{detail.customer.email} · {detail.customer.phone}</p><h3 className="admin-subheading">Order history</h3>{detail.orders.length ? detail.orders.map(order => <div className="admin-detail-row" key={order._id}><span>#{order._id.slice(-8).toUpperCase()}<small>{date(order.createdAt)}</small></span><strong>{currency(order.totalPrice)}</strong><Badge>{order.orderStatus}</Badge></div>) : <EmptyState title="No orders yet" text="This customer has not placed an order." />}</> : <><div className="admin-detail-row"><span><strong>{detail.name}</strong><small>{detail.email} · {detail.phone || 'No phone provided'}</small></span><Badge>{detail.status}</Badge></div><p className="admin-message-body">{detail.message}</p><p className="admin-hint">Received {date(detail.createdAt)}. Status changes stay in your admin panel.</p></>}</div></Modal>}</>
}
