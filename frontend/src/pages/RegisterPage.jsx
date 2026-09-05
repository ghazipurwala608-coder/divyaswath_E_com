import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { AuthLayout } from './LoginPage.jsx'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const submit = async (event) => { event.preventDefault(); if (form.password !== form.confirmPassword) return toast.error('Passwords do not match'); setLoading(true); try { await register(form); toast.success('Your account is ready'); navigate('/account') } catch (error) { toast.error(error.message) } finally { setLoading(false) } }
  const input = 'mt-2 w-full rounded-xl border border-[#d9dfd5] bg-white px-4 py-3 font-normal normal-case tracking-normal outline-none focus:border-[#b88628] focus:ring-4 focus:ring-[#b88628]/10'
  return <AuthLayout title="Create your account" subtitle="A secure way to manage orders and wellness essentials."><form onSubmit={submit} className="mt-8 grid gap-4"><Field label="Full name"><input required maxLength="80" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={input} placeholder="Your full name" /></Field><Field label="Email address"><input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={input} placeholder="you@example.com" /></Field><Field label="Phone number"><input required inputMode="numeric" pattern="[0-9]{10}" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={input} placeholder="10 digit mobile number" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Password"><input type="password" minLength="8" required autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={input} /></Field><Field label="Confirm password"><input type="password" minLength="8" required autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className={input} /></Field></div><p className="text-[10px] leading-5 text-[#78847c]">Use at least 8 characters. Production deployments should enforce a stronger password policy and HTTPS.</p><button disabled={loading} className="mt-2 rounded-full bg-[#123b2a] py-4 text-[10px] font-black uppercase tracking-[.14em] text-white hover:bg-[#b98524] disabled:opacity-60">{loading ? 'Creating account...' : 'Create account'}</button><p className="text-center text-sm text-[#718077]">Already a member? <Link to="/login" className="font-bold text-[#9d6c18]">Sign in</Link></p></form></AuthLayout>
}
function Field({ label, children }) { return <label className="text-[10px] font-black uppercase tracking-wider text-[#4f5e54]">{label}{children}</label> }
