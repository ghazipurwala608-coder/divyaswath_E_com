import { useState } from 'react'
import { Pencil, Save, Trash2, X } from 'lucide-react'

export default function DeliveryTeamMember({ driver, activeDeliveries, busy, mutate }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const save = async event => {
    event.preventDefault()
    const body = Object.fromEntries(new FormData(event.currentTarget))
    if (!body.password) delete body.password
    if (await mutate(`/delivery/team/${driver._id}`, body)) setEditing(false)
  }
  return <div style={{ borderBottom: '1px solid #e3e9df', padding: '15px 0' }}>
    <div className="delivery-row"><strong>{driver.name}</strong><span className="delivery-badge">{driver.deliveryActive ? 'Active' : 'Paused'}</span></div>
    {editing ? <form onSubmit={save}>
      <fieldset disabled={busy}>
        {[
          ['name', 'Full name', 'text', 80],
          ['email', 'Login email', 'email', 254],
          ['phone', 'Phone', 'tel', 10],
          ['deliveryArea', 'Delivery area / PIN codes', 'text', 120],
          ['password', 'New password (leave blank to keep current)', 'password', 72],
        ].map(([name, label, type, maxLength]) => <div key={name}><label htmlFor={`${driver._id}-${name}`}>{label}</label><input id={`${driver._id}-${name}`} name={name} type={type} defaultValue={name === 'password' ? '' : driver[name] || ''} required={name !== 'password'} maxLength={maxLength} minLength={name === 'password' ? 8 : undefined} pattern={name === 'phone' ? '[0-9]{10}' : undefined} autoComplete={name === 'password' ? 'new-password' : undefined} /></div>)}
        <div className="delivery-actions"><button type="submit" className="primary"><Save size={15} />Save changes</button><button type="button" onClick={() => setEditing(false)}><X size={15} />Cancel</button></div>
      </fieldset>
    </form> : <>
      <p>{driver.deliveryArea || 'Area not set'}<br />{driver.email} · <a href={`tel:${driver.phone}`}>{driver.phone}</a></p>
      <p className="delivery-muted">{activeDeliveries} active deliveries</p>
      <div className="delivery-actions">
        <button type="button" disabled={busy} onClick={() => { setEditing(true); setConfirmDelete(false) }}><Pencil size={15} />Edit</button>
        <button type="button" disabled={busy} onClick={() => mutate(`/delivery/team/${driver._id}`, { deliveryActive: !driver.deliveryActive })}>{driver.deliveryActive ? 'Pause access' : 'Activate'}</button>
        <button type="button" disabled={busy} onClick={() => setConfirmDelete(true)} style={{ color: '#a5362c', borderColor: '#e8c9c3' }}><Trash2 size={15} />Delete</button>
      </div>
    </>}
    {confirmDelete && <div role="alert" style={{ marginTop: 12, padding: 14, background: '#fff5f1', border: '1px solid #ecd1c8', borderRadius: 10 }}>
      {activeDeliveries ? <p>Reassign {driver.name}’s {activeDeliveries} active deliveries below before deleting this account.</p> : <p>Delete {driver.name}’s delivery account? They will lose login access. Previous order tracking history will remain.</p>}
      <div className="delivery-actions">{!activeDeliveries && <button type="button" disabled={busy} onClick={() => mutate(`/delivery/team/${driver._id}`, undefined, 'DELETE')} style={{ background: '#a5362c', color: 'white' }}>Confirm delete</button>}<button type="button" disabled={busy} onClick={() => setConfirmDelete(false)}>Cancel</button></div>
    </div>}
  </div>
}
