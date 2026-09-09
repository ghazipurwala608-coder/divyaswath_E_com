import { useSiteContent } from '../context/SiteContentContext.jsx'
import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, PackageCheck, ShieldCheck, Sprout, Truck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import './LoginReference.css'



export default function LoginReference({ initialSignup = false }) {
  const siteContent = useSiteContent('login-reference', siteIcons)

  const [form, setForm] = useState(() => { let email = ''; try { email = localStorage.getItem('divyaRememberedEmail') || '' } catch { /* Storage may be unavailable. */ } return { name: '', phone: '', email, password: '', confirmPassword: '' } })
  const [signup, setSignup] = useState(initialSignup)
  const [remember, setRemember] = useState(Boolean(form.email))
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const switchMode = value => {
    setSignup(value)
    setError('')
    setShow(false)
    setForm(current => ({ ...current, password: '', confirmPassword: '' }))
    requestAnimationFrame(() => {
      document.getElementById('login-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById(value ? 'signup-name' : 'login-email')?.focus({ preventScroll: true })
    })
  }
  const submit = async event => {
    event.preventDefault()
    if (loading) return
    if (signup && !form.name.trim()) { setError('Please enter your full name'); return }
    if (signup && form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const signedIn = signup
        ? await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone, password: form.password })
        : await login({ email: form.email.trim(), password: form.password })
      try { if (remember) localStorage.setItem('divyaRememberedEmail', form.email); else localStorage.removeItem('divyaRememberedEmail') } catch { /* Remembering an email is optional. */ }
      toast.success(signup ? 'Your account is ready' : 'Welcome back')
      navigate(signedIn.isDriver ? '/delivery' : location.state?.from || (signedIn.isAdmin ? '/admin' : '/account'), { replace: true })
    } catch (err) { setError(err.message || 'Unable to sign in. Please try again.') }
    finally { setLoading(false) }
  }

  return <div className="account-reference login-reference"><div className="account-reference-inner">
    <section className="account-reference-hero" aria-labelledby="login-heading">
      <div className="account-reference-card login-card"><span className="account-kicker">{signup ? 'JOIN DIVYA SWASTH' : siteContent.text.welcome_back}</span><h1 id="login-heading">{signup ? 'Create your account' : siteContent.text.sign_in}</h1><p className="account-intro">{signup ? 'Begin your journey to natural wellness.' : siteContent.text.your_journey_to_natural_wellness_continues}<br />{signup ? 'Sign up below to manage your orders and deliveries.' : siteContent.text.sign_in_to_your_divya_swasth_account}</p>
        <form onSubmit={submit}><fieldset disabled={loading}>
          {signup && <label htmlFor="signup-name">Full name<input id="signup-name" autoComplete="name" required maxLength={80} placeholder="Enter your full name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>}
          <label htmlFor="login-email">{siteContent.text.email_address}<input id="login-email" type="email" autoComplete="username" required placeholder={siteContent.media.placeholder_1} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
          {signup && <label htmlFor="signup-phone">Phone number<input id="signup-phone" type="tel" autoComplete="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required placeholder="10 digit mobile number" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label>}
          <label htmlFor="login-password">{siteContent.text.password}</label><div className="login-password"><LockKeyhole size={14} aria-hidden="true" /><input id="login-password" type={show ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} minLength={signup ? 8 : undefined} required placeholder={siteContent.media.placeholder_2} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /><button type="button" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow(value => !value)}>{show ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
          {signup && <><label className="signup-confirm" htmlFor="signup-confirm">Confirm password<input id="signup-confirm" type={show ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="Re-enter your password" value={form.confirmPassword} onChange={event => setForm({ ...form, confirmPassword: event.target.value })} /></label><p className="login-social-note">Use at least 8 characters for your password.</p></>}
          <div className="login-options"><label><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} />{siteContent.text.remember_my_email}</label><Link to={siteContent.media.to_3}>{siteContent.text.need_help_signing_in}</Link></div>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button type="submit" className="account-submit"><LockKeyhole size={14} />{loading ? (signup ? 'Creating account…' : 'Signing in…') : signup ? 'Create account' : 'Sign in'}</button>
        </fieldset></form>
        {!signup && <><div className="account-or"><span>{siteContent.text.or_sign_in_with}</span></div>
        <div className="login-social"><button type="button" disabled title={siteContent.media.title_4}><span className="login-google" aria-hidden="true">{siteContent.text.g}</span>{siteContent.text.continue_with_google}</button><button type="button" disabled title={siteContent.media.title_5}><span className="login-facebook" aria-hidden="true">{siteContent.text.f}</span>{siteContent.text.continue_with_facebook}</button></div><p className="login-social-note">{siteContent.text.social_sign_in_coming_soon}</p>
        </>}
        <p className="account-help">{signup ? 'Already have an account? ' : siteContent.text.don_t_have_an_account}<button type="button" className="login-mode-toggle" disabled={loading} onClick={() => switchMode(!signup)}>{signup ? 'Sign in' : siteContent.text.create_an_account}<ArrowRight size={10} /></button></p>
      </div>
      <div className="account-reference-art"><div className="account-promise"><h2>{siteContent.text.your_health}<br />{siteContent.text.our_promise}</h2><div className="account-flourish"><span /><Leaf size={15} /><span /></div><p>{siteContent.text.rooted_in_nature}<br />{siteContent.text.inspired_by_your_wellbeing}<br />{siteContent.text.discover_a_thoughtful_approach}<br />{siteContent.text.to_your_everyday_wellness}</p></div></div>
    </section>
    <section className="account-promises" aria-label="Your account benefits">{siteContent.sections.benefits.map(([Icon, title, text]) => <article key={title}><span><Icon /></span><h2>{title}</h2><p>{text}</p></article>)}</section>
    {!signup && <section className="account-join"><span className="account-join-icon"><Leaf /></span><div><h2>{siteContent.text.new_to_divya_swasth}</h2><p>{siteContent.text.create_an_account_and_begin_your_journey_to_n}</p></div><button type="button" className="login-join-toggle" disabled={loading} onClick={() => switchMode(true)}>{siteContent.text.create_an_account_2}<ArrowRight size={13} /></button></section>}
  </div></div>
}

const siteIcons = { PackageCheck, ShieldCheck, Sprout, Truck }
