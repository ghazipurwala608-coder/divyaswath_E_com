import { 
  Eye, 
  Search, 
  Phone, 
  MessageSquare, 
  Trash2, 
  Sparkles, 
  UserCheck, 
  UsersRound,
  Clock, 
  Activity, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  FileText 
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { Badge, DataState, date, EmptyState, Modal, useAdminData } from './AdminUI.jsx'

export default function LeadsPanel() {
  const { data, setData, loading, error, reload } = useAdminData('/admin/leads')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [busy, setBusy] = useState('')
  const [detail, setDetail] = useState(null)
  const [adminNote, setAdminNote] = useState('')

  const allLeads = data?.leads || []

  // Filter leads
  const rows = allLeads.filter(item => {
    const matchesQuery = `${item.name || ''} ${item.phone || ''} ${item.city || ''} ${item.goal || ''} ${item.status || ''} ${item.productName || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    return matchesQuery && matchesStatus
  })

  // Summary counts
  const totalCount = allLeads.length
  const newCount = allLeads.filter(l => l.status === 'New Lead').length
  const contactedCount = allLeads.filter(l => l.status === 'Contacted' || l.status === 'Consulted').length
  const convertedCount = allLeads.filter(l => l.status === 'Converted').length

  const updateLeadStatus = async (id, status, notes) => {
    setBusy(id)
    try {
      const payload = { status }
      if (typeof notes === 'string') payload.notes = notes
      const result = await apiRequest(`/admin/leads/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify(payload) 
      })
      const updated = result.lead
      setData(current => ({
        ...current,
        leads: current.leads.map(item => item._id === id ? updated : item)
      }))
      if (detail?._id === id) {
        setDetail(updated)
      }
      toast.success('Lead updated successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to update lead')
    } finally {
      setBusy('')
    }
  }

  const deleteLeadRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment lead?')) return
    setBusy(id)
    try {
      await apiRequest(`/admin/leads/${id}`, { method: 'DELETE' })
      setData(current => ({
        ...current,
        leads: current.leads.filter(item => item._id !== id)
      }))
      if (detail?._id === id) setDetail(null)
      toast.success('Lead deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete lead')
    } finally {
      setBusy('')
    }
  }

  const openWhatsApp = (lead) => {
    const text = encodeURIComponent(
      `Namaste ${lead.name || 'Friend'}! This is Dr. / Vaidya Team from Divya Swasth regarding your Ayurvedic assessment for ${lead.goal}. We are reviewing your wellness profile to suggest the optimal natural care plan.`
    )
    window.open(`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=${text}`, '_blank')
  }

  const openDetailModal = (lead) => {
    setDetail(lead)
    setAdminNote(lead.notes || '')
  }

  const handleSaveNotes = () => {
    if (!detail) return
    updateLeadStatus(detail._id, detail.status, adminNote)
  }

  return (
    <>
      {/* Metric Cards Summary Bar */}
      <div className="admin-stats">
        <div className="admin-stat-card customers">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Total Leads</span>
            <div className="admin-stat-icon-wrapper customers">
              <UsersRound size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{totalCount}</strong>
          <span className="admin-stat-description">Prospective patient quiz submissions</span>
        </div>

        <div className="admin-stat-card products">
          <div className="admin-stat-header">
            <span className="admin-stat-title">New Uncontacted</span>
            <div className="admin-stat-icon-wrapper products">
              <Clock size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{newCount}</strong>
          <span className="admin-stat-description">Awaiting first Vaidya call/chat</span>
        </div>

        <div className="admin-stat-card orders">
          <div className="admin-stat-header">
            <span className="admin-stat-title">In Consultation</span>
            <div className="admin-stat-icon-wrapper orders">
              <MessageSquare size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{contactedCount}</strong>
          <span className="admin-stat-description">Under active doctor follow-up</span>
        </div>

        <div className="admin-stat-card revenue">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Converted Orders</span>
            <div className="admin-stat-icon-wrapper revenue">
              <CheckCircle2 size={19} />
            </div>
          </div>
          <strong className="admin-stat-value">{convertedCount}</strong>
          <span className="admin-stat-description">Successfully placed remedy order</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'between' }}>
        <label className="admin-search" style={{ flex: '1', minWidth: '240px' }}>
          <Search size={17} />
          <input 
            placeholder="Search by patient name, phone, city, or goal…" 
            value={query} 
            onChange={event => setQuery(event.target.value)} 
          />
        </label>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'New Lead', 'Contacted', 'Consulted', 'Converted', 'Closed'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`admin-button ${statusFilter === status ? '' : 'secondary'}`}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <DataState loading={loading} error={error} retry={reload}>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Health Assessment Leads</h2>
              <p>Personalized consultation submissions from website visitors</p>
            </div>
            <Badge tone="green">{rows.length} records</Badge>
          </div>

          {rows.length ? (
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Phone & Actions</th>
                    <th>Goal & Timeline</th>
                    <th>City / Pincode</th>
                    <th>Received Date</th>
                    <th>Lead Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(item => (
                    <tr key={item._id}>
                      {/* Name */}
                      <td>
                        <strong>{item.name}</strong>
                        <small className="admin-block" style={{ color: '#64748b' }}>
                          Age: {item.ageGroup || 'Not specified'}
                        </small>
                      </td>

                      {/* Phone & Direct Chat */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{item.phone}</span>
                          
                          {/* WhatsApp Trigger */}
                          <button
                            type="button"
                            className="admin-icon-button"
                            title="Chat on WhatsApp"
                            onClick={() => openWhatsApp(item)}
                            style={{ color: '#16a34a' }}
                          >
                            <MessageSquare size={15} />
                          </button>

                          {/* Call Trigger */}
                          <a
                            href={`tel:${item.phone}`}
                            className="admin-icon-button"
                            title="Call Mobile"
                            style={{ color: '#0284c7' }}
                          >
                            <Phone size={15} />
                          </a>
                        </div>
                      </td>

                      {/* Health Goal */}
                      <td>
                        <strong>{item.goal}</strong>
                        <small className="admin-block" style={{ color: '#64748b' }}>
                          Stage: {item.duration || 'Standard'}
                        </small>
                      </td>

                      {/* City */}
                      <td>{item.city || '—'}</td>

                      {/* Date */}
                      <td>{date(item.createdAt)}</td>

                      {/* Status Dropdown */}
                      <td>
                        <select
                          disabled={busy === item._id}
                          value={item.status}
                          onChange={event => updateLeadStatus(item._id, event.target.value)}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            backgroundColor: 
                              item.status === 'New Lead' ? '#fef3c7' :
                              item.status === 'Converted' ? '#dcfce7' :
                              item.status === 'Contacted' ? '#e0f2fe' : '#f1f5f9',
                            color: 
                              item.status === 'New Lead' ? '#92400e' :
                              item.status === 'Converted' ? '#166534' :
                              item.status === 'Contacted' ? '#0369a1' : '#334155'
                          }}
                        >
                          {['New Lead', 'Contacted', 'Consulted', 'Converted', 'Closed'].map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            type="button"
                            className="admin-icon-button"
                            title="View Full Profile & Notes"
                            onClick={() => openDetailModal(item)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-button"
                            title="Delete Lead"
                            disabled={busy === item._id}
                            onClick={() => deleteLeadRecord(item._id)}
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              title="No Assessment Leads Found" 
              text={query || statusFilter !== 'All' ? 'Try changing your search query or filter.' : 'When visitors complete the 1-minute Ayurvedic quiz on the homepage, their submissions will appear here instantly.'} 
            />
          )}
        </section>
      </DataState>

      {/* Detailed Modal for Single Lead */}
      {detail && (
        <Modal title={`Assessment Lead: ${detail.name}`} onClose={() => setDetail(null)}>
          <div className="admin-modal-body">
            
            {/* Contact Information Bar */}
            <div className="admin-detail-row" style={{ paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{detail.name}</strong>
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.3rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <span>📞 {detail.phone}</span>
                  {detail.city && <span>📍 {detail.city}</span>}
                  <span>🎂 Age: {detail.ageGroup || 'Not specified'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="admin-button"
                  onClick={() => openWhatsApp(detail)}
                  style={{ backgroundColor: '#16a34a', color: '#ffffff', borderColor: '#16a34a', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <MessageSquare size={14} /> WhatsApp Chat
                </button>
                <a
                  href={`tel:${detail.phone}`}
                  className="admin-button secondary"
                  style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Phone size={14} /> Call
                </a>
              </div>
            </div>

            {/* Assessment Details Grid */}
            <div style={{ marginTop: '1rem' }}>
              <h3 className="admin-subheading" style={{ marginBottom: '0.5rem' }}>Ayurvedic Assessment Profile</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Primary Health Focus</small>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{detail.goal}</strong>
                </div>

                <div>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Condition Duration</small>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{detail.duration || 'Standard'}</strong>
                </div>

                <div>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Submission Source</small>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{detail.source || 'Homepage 1-Min Quiz'}</strong>
                </div>

                <div>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Submitted At</small>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{date(detail.createdAt)}</strong>
                </div>
              </div>
            </div>

            {/* Admin Notes Section */}
            <div style={{ marginTop: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.4rem', color: '#1e293b' }}>
                Doctor / Admin Follow-up Notes:
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="Add notes about patient consultation, call outcome, prescribed kit, or scheduled callback…"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  disabled={busy === detail._id}
                  onClick={handleSaveNotes}
                  className="admin-button"
                  style={{ backgroundColor: '#0e3b24', color: '#faedd0', borderColor: '#0e3b24', fontSize: '0.8rem' }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
