import { Camera, Leaf, Sparkles } from 'lucide-react'

const palettes = {
  lime: 'from-[#d9e9a8] via-[#a7c467] to-[#315a34]',
  emerald: 'from-[#c8dfc3] via-[#56936c] to-[#164c37]',
  amber: 'from-[#f0dfad] via-[#c89a3b] to-[#6b4616]',
  gold: 'from-[#ead797] via-[#b8862b] to-[#49310f]',
  sage: 'from-[#dce5cc] via-[#9eb281] to-[#4f6745]',
}

export default function ProductVisual({ product, compact = false }) {
  const image = product.images?.[0]
  const hasPreview = image && product.imageStatus !== 'Pending'
  return (
    <div className={`relative overflow-hidden rounded-[1.35rem] bg-[#edf0e7] ${compact ? 'h-full min-h-[254px] w-full rounded-none' : 'min-h-[440px]'}`}>
      {hasPreview ? <img src={image} alt={`${product.name} temporary concept preview`} className={`h-full w-full mix-blend-multiply ${compact ? 'origin-center object-cover object-center scale-110' : 'object-contain px-2'}`} /> : <div className="flex h-full min-h-[inherit] flex-col items-center justify-center px-7 text-center">
        <img src="/images/botanical-hero-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#e7ede2] via-[#edf0e7]/80 to-[#edf0e7]/45" />
        <div className={`absolute inset-0 bg-gradient-to-br ${palettes[product.theme] || palettes.gold} opacity-20`} />
        <span className="absolute left-8 top-8 h-28 w-28 rounded-full border border-[#143c2a]/10" />
        <span className="absolute bottom-10 right-8 h-20 w-20 rounded-full bg-[#d5a94e]/20 blur-2xl" />
        <Leaf className="animate-drift absolute -bottom-6 -left-4 h-44 w-44 text-[#50795b]/15" strokeWidth={.7} />
        <div className="relative grid h-16 w-16 place-items-center rounded-full border border-[#8c6a26]/20 bg-white/55 shadow-[0_18px_50px_rgba(25,56,36,.12)] backdrop-blur"><Camera className="h-7 w-7 text-[#3b6649]" strokeWidth={1.25} /></div>
        <p className="relative mt-4 text-[8px] font-black uppercase tracking-[.2em] text-[#8c6823]">Approved photography pending</p>
        <p className="relative mt-1.5 font-display text-2xl font-bold text-[#153824]">{product.name}</p>
        <p className="relative mt-2 max-w-xs text-xs leading-5 text-[#657269]">Final high-resolution product photographs will replace this pre-launch placeholder.</p>
      </div>}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-center gap-2 rounded-full border border-white/50 bg-[#102c20]/90 px-3 py-2 text-center text-[7px] font-black uppercase tracking-[.12em] text-[#f5df9b] backdrop-blur"><Sparkles className="h-3 w-3" /> {product.imageStatus === 'Concept' ? 'Temporary concept — not final packaging' : 'Photography pending — not final packaging'}</div>
    </div>
  )
}
