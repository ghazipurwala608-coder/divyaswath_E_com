export default function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={`text-[11px] font-extrabold uppercase tracking-[0.28em] ${light ? 'text-[#d4ad57]' : 'text-[#a26f16]'}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl ${light ? 'text-[#fff9e9]' : 'text-[#193322]'}`}>{title}</h2>
      {description && <p className={`mx-auto mt-4 max-w-xl text-sm leading-7 ${light ? 'text-[#dce5dd]/70' : 'text-[#647168]'}`}>{description}</p>}
    </div>
  )
}

