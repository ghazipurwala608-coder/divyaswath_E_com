import { BadgeCheck, Box, Check, CheckCircle2, Clock3, PackageCheck, ShoppingBag, Truck } from 'lucide-react'
import { ORDER_FLOW, orderStepIndex } from '../data/orderTracking.js'

const icons = [ShoppingBag, BadgeCheck, Box, PackageCheck, Truck, CheckCircle2]

export default function OrderTimeline({ status, detailed = false }) {
  const currentIndex = orderStepIndex(status)

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[#edcbc6] bg-[#fff3f0] p-4 text-[#93483e]">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f6ded9]"><Clock3 className="h-5 w-5" /></span>
        <div><p className="text-xs font-black uppercase tracking-wider">Order cancelled</p><p className="mt-1 text-[10px] text-[#9b655e]">This delivery will not move forward. Contact support if you need help.</p></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className={`grid grid-cols-6 ${detailed ? 'min-w-[760px]' : 'min-w-[680px]'}`}>
        {ORDER_FLOW.map((step, index) => {
          const Icon = icons[index]
          const complete = index < currentIndex
          const current = index === currentIndex
          return (
            <div key={step.status} className="relative text-center">
              {index < ORDER_FLOW.length - 1 && <span className={`absolute left-1/2 h-0.5 w-full ${detailed ? 'top-[23px]' : 'top-[19px]'} ${index < currentIndex ? 'bg-[#4e8055]' : 'bg-[#dfe4dc]'}`} />}
              <div className={`relative z-10 mx-auto grid place-items-center rounded-full border-4 border-white shadow-sm ${detailed ? 'h-12 w-12' : 'h-10 w-10'} ${complete ? 'bg-[#4e8055] text-white' : current ? 'bg-[#d5a745] text-[#143221] ring-4 ring-[#d5a745]/15' : 'bg-[#edf0eb] text-[#9ba59e]'}`}>
                {complete ? <Check className={detailed ? 'h-5 w-5' : 'h-4 w-4'} /> : <Icon className={detailed ? 'h-5 w-5' : 'h-4 w-4'} />}
              </div>
              <p className={`mt-3 px-1 font-black uppercase tracking-[.06em] ${detailed ? 'text-[10px]' : 'text-[8px]'} ${complete || current ? 'text-[#24432e]' : 'text-[#929d95]'}`}>{step.shortLabel}</p>
              {detailed && <p className={`mx-auto mt-1 max-w-[105px] px-1 text-[9px] leading-4 ${complete || current ? 'text-[#718078]' : 'text-[#a4aca6]'}`}>{step.description}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
