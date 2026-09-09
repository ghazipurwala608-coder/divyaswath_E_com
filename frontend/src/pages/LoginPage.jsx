import { useSiteContent } from '../context/SiteContentContext.jsx'
import { Check, Leaf, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
export { default } from './LoginReference.jsx'

export function AuthLayout({ title, subtitle, children }) {
  const siteContent = useSiteContent('login', siteIcons)

  return (
    <section className="auth-shell relative isolate grid min-h-[calc(100svh-76px)] overflow-hidden bg-[#f8f3e8] lg:grid-cols-[.92fr_1.08fr]">
      <div className="auth-visual grain relative hidden overflow-hidden bg-[#0a2419] text-white lg:flex lg:min-h-[540px] lg:flex-col lg:justify-between lg:p-9 xl:p-11">
        <img src={siteContent.media.src_1} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,22,14,.3),rgba(4,22,14,.78)_58%,#06170f)]" />
        <div className="auth-visual-glow absolute -left-16 top-16 h-72 w-72 rounded-full bg-[#c99a32]/15 blur-3xl" />

        <div className="animate-rise relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-2 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-[#e1b756]" />
            <span className="text-[8px] font-black uppercase tracking-[.2em] text-white/65">{siteContent.text.private_protected_personal}</span>
          </div>
          <Sparkles className="h-4 w-4 text-[#e1b756]/70" />
        </div>

        <div className="auth-botanical-graphic pointer-events-none absolute left-1/2 top-[42%] z-10 h-52 w-52 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <div className="auth-orbit auth-orbit-one absolute inset-0 rounded-full border border-[#e0b754]/25">
            <span className="absolute left-1/2 top-[-4px] h-2 w-2 rounded-full bg-[#e5bd62] shadow-[0_0_16px_#e5bd62]" />
          </div>
          <div className="auth-orbit auth-orbit-two absolute inset-7 rounded-full border border-dashed border-white/20">
            <span className="absolute bottom-2 right-3 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_12px_white]" />
          </div>
          <div className="auth-leaf-core absolute inset-14 grid place-items-center rounded-full border border-[#e2b958]/35 bg-[#102f21]/80 shadow-[0_0_55px_rgba(211,169,72,.18)] backdrop-blur-md">
            <Leaf className="h-10 w-10 text-[#e1b756]" strokeWidth={1.25} />
          </div>
          <Leaf className="auth-floating-leaf absolute -right-7 top-10 h-8 w-8 rotate-[28deg] text-[#85a47c]/60" strokeWidth={1} />
          <Leaf className="auth-floating-leaf auth-floating-leaf-delay absolute -left-5 bottom-4 h-6 w-6 -rotate-[38deg] text-[#d6ad56]/55" strokeWidth={1} />
        </div>

        <div className="animate-rise-delay relative z-10 max-w-lg">
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-[#d2a64d]/45 bg-[#d2a64d]/10 backdrop-blur-sm">
            <LockKeyhole className="h-4.5 w-4.5 text-[#e1b756]" />
          </div>
          <p className="max-w-md font-display text-[clamp(2rem,3.25vw,2.85rem)] leading-[1.06] text-[#fff6de]">{siteContent.text.your_wellness_journey_in_one_secure_place}</p>
          <p className="mt-3 max-w-md text-xs leading-6 text-white/55">{siteContent.text.your_orders_delivery_details_and_wellness_pre}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[9px] font-bold uppercase tracking-[.12em] text-white/45">
            <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[#dcb75f]" />{siteContent.text.secure_access}</span>
            <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[#dcb75f]" />{siteContent.text.easy_order_tracking}</span>
          </div>
        </div>
      </div>

      <div className="auth-form-panel relative flex min-w-0 items-center overflow-hidden px-4 py-7 sm:px-8 lg:px-12 xl:px-16">
        <div className="auth-form-orb absolute -right-28 -top-24 h-72 w-72 rounded-full border border-[#c99a32]/15" />
        <div className="auth-form-orb auth-form-orb-delay absolute -bottom-28 left-10 h-56 w-56 rounded-full border border-[#123b2a]/10" />
        <Leaf className="auth-panel-leaf absolute right-[8%] top-[12%] h-16 w-16 rotate-12 text-[#b58a34]/[.07]" strokeWidth={0.8} aria-hidden="true" />

        <div className="animate-rise-delay-2 relative mx-auto min-w-0 w-full max-w-[450px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#dec994] bg-[#fffaf0] px-3 py-1.5 text-[8px] font-black uppercase tracking-[.2em] text-[#956416] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b98524] shadow-[0_0_0_4px_rgba(185,133,36,.12)]" />{siteContent.text.divya_swasth_account}</div>
          <h1 className="font-display text-[clamp(2.35rem,4vw,3.35rem)] leading-none text-[#183222]">{title}</h1>
          <p className="mt-2.5 text-sm leading-6 text-[#6f7a73]">{subtitle}</p>

          <div className="mt-5 min-w-0 rounded-[24px] border border-white/80 bg-white/75 p-5 shadow-[0_24px_65px_rgba(43,62,48,.10)] ring-1 ring-[#153d2b]/[.04] backdrop-blur-xl [&>form]:mt-0 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

const siteIcons = {  }
