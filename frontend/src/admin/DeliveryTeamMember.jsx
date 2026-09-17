import { useState } from 'react'
import { Pencil, Save, Trash2, X, Pause, Play, MapPin, Mail, Phone, Package, UserCheck, Shield } from 'lucide-react'
import { Badge } from './AdminUI.jsx'

export default function DeliveryTeamMember({ driver, activeDeliveries, busy, mutate }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const save = async (event) => {
    event.preventDefault()
    const body = Object.fromEntries(new FormData(event.currentTarget))
    if (!body.password) delete body.password
    if (await mutate(`/delivery/team/${driver._id}`, body)) {
      setEditing(false)
    }
  }

  // Get driver initials for avatar
  const initials = (driver.name || 'D')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div 
      style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px', 
        padding: '16px', 
        marginBottom: '12px',
        backgroundColor: '#ffffff',
        transition: 'border-color 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* ── Card Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '10px', 
              backgroundColor: driver.deliveryActive ? '#eaf5f0' : '#f1f5f9',
              color: driver.deliveryActive ? '#14533d' : '#64748b',
              border: `1px solid ${driver.deliveryActive ? '#bbf7d0' : '#cbd5e1'}`,
              display: 'grid', 
              placeItems: 'center', 
              fontWeight: '800', 
              fontSize: '14px' 
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {driver.name}
              </h4>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Delivery Partner ID: #{driver._id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        <Badge tone={driver.deliveryActive ? 'green' : ''}>
          {driver.deliveryActive ? 'Active' : 'Paused'}
        </Badge>
      </div>

      {editing ? (
        /* ── Edit Form Inside Card ── */
        <form onSubmit={save} style={{ marginTop: '14px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <fieldset disabled={busy} style={{ border: 'none', padding: 0, margin: 0 }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                ['name', 'Full Name', 'text', 80],
                ['email', 'Login Email', 'email', 254],
                ['phone', 'Phone Number', 'tel', 10],
                ['deliveryArea', 'Servicing Area / PIN Codes', 'text', 120],
                ['password', 'New Password (leave blank to keep current)', 'password', 72],
              ].map(([name, label, type, maxLength]) => (
                <div key={name}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#475569' }}>
                    {label}
                  </label>
                  <input
                    name={name}
                    type={type}
                    defaultValue={name === 'password' ? '' : driver[name] || ''}
                    required={name !== 'password'}
                    maxLength={maxLength}
                    minLength={name === 'password' ? 8 : undefined}
                    pattern={name === 'phone' ? '[0-9]{10}' : undefined}
                    autoComplete={name === 'password' ? 'new-password' : undefined}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button 
                type="submit" 
                className="admin-button"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                <Save size={14} /> Save changes
              </button>
              <button 
                type="button" 
                className="admin-button secondary"
                onClick={() => setEditing(false)}
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </fieldset>
        </form>
      ) : (
        /* ── Standard Card Body ── */
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          
          {/* Details Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#0e3b24" />
              <strong style={{ color: '#0f172a' }}>Servicing Area:</strong>
              <span style={{ color: '#475569' }}>{driver.deliveryArea || 'Area not set'}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '2px', color: '#475569' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={13} color="#64748b" /> {driver.email}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={13} color="#64748b" /> 
                <a href={`tel:${driver.phone}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '600' }}>
                  {driver.phone}
                </a>
              </span>
            </div>
          </div>

          {/* Active Deliveries Status Chip */}
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
              <Package size={14} color="#0e3b24" />
              <span>Active Assigned Deliveries:</span>
              <strong style={{ color: '#0e3b24', fontSize: '13px' }}>{activeDeliveries} Orders</strong>
            </div>

            {driver.deliveryActive ? (
              <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>● Ready for dispatch</span>
            ) : (
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>○ Portal login paused</span>
            )}
          </div>

          {/* Action Buttons Toolbar */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              className="admin-button secondary"
              disabled={busy}
              onClick={() => { setEditing(true); setConfirmDelete(false) }}
              style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Pencil size={13} /> Edit
            </button>

            <button
              type="button"
              className="admin-button secondary"
              disabled={busy}
              onClick={() => mutate(`/delivery/team/${driver._id}`, { deliveryActive: !driver.deliveryActive })}
              style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              {driver.deliveryActive ? (
                <><Pause size={13} /> Pause Access</>
              ) : (
                <><Play size={13} /> Activate</>
              )}
            </button>

            <button
              type="button"
              className="admin-button secondary"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
              style={{ fontSize: '12px', padding: '6px 12px', color: '#dc2626', borderColor: '#fecaca', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {confirmDelete && (
        <div role="alert" style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px' }}>
          {activeDeliveries ? (
            <p style={{ color: '#991b1b', margin: 0, fontWeight: '600' }}>
              ⚠️ Reassign {driver.name}’s {activeDeliveries} active deliveries below before deleting this account.
            </p>
          ) : (
            <p style={{ color: '#991b1b', margin: 0 }}>
              Are you sure you want to delete <strong>{driver.name}</strong>’s delivery account?
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {!activeDeliveries && (
              <button
                type="button"
                className="admin-button"
                disabled={busy}
                onClick={() => mutate(`/delivery/team/${driver._id}`, undefined, 'DELETE')}
                style={{ background: '#dc2626', color: '#ffffff', borderColor: '#dc2626', fontSize: '12px', padding: '6px 12px' }}
              >
                Confirm Delete
              </button>
            )}
            <button
              type="button"
              className="admin-button secondary"
              disabled={busy}
              onClick={() => setConfirmDelete(false)}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
