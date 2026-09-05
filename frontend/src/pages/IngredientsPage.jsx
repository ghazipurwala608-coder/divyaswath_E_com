import { ArrowRight, ChevronDown, FlaskConical, Leaf, Search, ShieldCheck, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'

const ingredients = [
  ['Ashwagandha', 'Withania somnifera', 'An adaptogenic root long valued in Ayurveda for balanced daily wellness.', 'ASWAGHANDHA.png'],
  ['Amla', 'Phyllanthus emblica', 'A vibrant Indian superfruit traditionally used to support everyday vitality.', 'AWALA.png'],
  ['Jamun', 'Syzygium cumini', 'A deep purple fruit with a cherished place in Indian wellness traditions.', 'JAMUN.png'],
  ['Methi', 'Trigonella foenum-graecum', 'Golden fenugreek seeds, a time-honoured staple of Indian tradition.', 'METHI.png'],
  ['Shatavari', 'Asparagus racemosus', 'A cherished Ayurvedic herb selected with care for its rich heritage.', 'satwari.png'],
  ['Neem', 'Azadirachta indica', 'A traditional botanical with a long history in everyday care rituals.', 'NEEM.png'],
  ['Shilajit', 'Asphaltum punjabianum', 'A mineral-rich resin selected for our considered wellness range.', 'Shilajit.png'],
  ['Garcinia', 'Garcinia cambogia', 'A tropical fruit botanical, carefully considered for our product range.', 'carchinia.png'],
]

const promises = [[Sprout, 'Pure & natural', 'Thoughtfully chosen botanicals'], [FlaskConical, 'Science backed', 'Carefully considered formulations'], [Leaf, 'Rooted in Ayurveda', 'Traditional wisdom, modern care'], [ShieldCheck, 'Quality assured', 'Made with uncompromising care']]

export default function IngredientsPage() {
  return <div className="overflow-hidden bg-[#fffdf7] text-[#19351f]">
    <section className="relative min-h-[320px] overflow-hidden border-b border-[#e5ddca] bg-[#f7f3e8] px-4 py-9 sm:min-h-[360px] sm:px-6 lg:px-8 lg:py-11">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#143c2a]" />
      <img src="/images/ingredients/hero intge.png" alt="Mortar and pestle surrounded by carefully selected herbs and botanicals" className="absolute inset-0 h-full w-full object-cover object-[64%_center] sm:object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3e8] via-[#f7f3e8]/80 to-transparent sm:via-[#f7f3e8]/22" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-[19rem] sm:max-w-md">
          <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#987022]">Our ingredients</p>
          <h1 className="mt-2 font-display text-3xl leading-[.91] text-[#183822] sm:text-4xl lg:text-5xl">Powered by <span className="text-[#a77925]">nature.</span><br />Crafted with purpose.</h1>
          <p className="mt-4 max-w-sm text-xs leading-5 text-[#526553]">Every DivyaSwasth formula begins with ingredients selected for their heritage, quality and place in a responsible wellness routine.</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[8px] font-bold uppercase tracking-[.07em] text-[#405b45]">
            <span className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-[#a57622]" /> Plant powered</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#a57622]" /> Quality first</span>
            <span className="flex items-center gap-1.5"><FlaskConical className="h-3.5 w-3.5 text-[#a57622]" /> Clearly labelled</span>
          </div>
        </div>
      </div>
    </section>

    <div className="bg-[#123c29] px-4 py-3 text-[#f5d585]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-center text-[8px] font-bold uppercase tracking-[.14em] sm:text-[9px]">
        <span>Thoughtful sourcing</span>
        <span>Transparent ingredient information</span>
        <span>Wellness, responsibly</span>
      </div>
    </div>

    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-[#e3ddcc] pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#a37522]">Explore the library</p>
            <h2 className="mt-2 font-display text-3xl text-[#193923] sm:text-4xl">Nature&apos;s finest ingredients</h2>
            <p className="mt-2 text-xs text-[#748075]">Discover the botanicals behind our wellness philosophy.</p>
          </div>

          <div className="flex w-full gap-2 md:w-auto">
            <label className="flex h-10 flex-1 items-center gap-2 border border-[#ddd6c6] bg-white px-3 md:w-56">
              <Search className="h-3.5 w-3.5 text-[#8f9b8d]" />
              <input aria-label="Search ingredients" placeholder="Search ingredients..." className="w-full bg-transparent text-[10px] outline-none placeholder:text-[#9aa397]" />
            </label>
            <button type="button" className="flex h-10 items-center gap-5 border border-[#ddd6c6] bg-white px-3 text-[9px] font-bold text-[#536153]">
              Sort A–Z <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map(([name, latin, text, image]) => (
            <article key={name} className="group overflow-hidden rounded-[1.4rem] border border-[#e2dbcb] bg-[#fffefa] shadow-[0_10px_25px_rgba(20,35,28,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(17,33,25,0.12)]">
              <div className="h-52 overflow-hidden bg-[#efe9dc]">
                <img
                  src={`/images/ingredients/${image}`}
                  alt={`${name} botanical ingredient`}
                  loading="lazy"
                  className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <p className="text-[8px] font-bold uppercase tracking-[.13em] text-[#aa7d2c]">Botanical ingredient</p>
                <h3 className="mt-1 font-display text-xl text-[#1c3922]">{name}</h3>
                <p className="mt-0.5 font-display text-[11px] italic text-[#9a8561]">{latin}</p>
                <p className="mt-3 min-h-10 text-[10px] leading-5 text-[#69766b]">{text}</p>
                <Link to="/products/lean-shape-garcinia-cambogia" className="mt-4 inline-flex items-center gap-1 border-b border-[#a97925] pb-1 text-[8px] font-black uppercase tracking-[.12em] text-[#73551d] transition hover:text-[#1d3d30]">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="border-y border-[#e2dccd] bg-[#f3f1e8] px-4 py-9 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map(([Icon, title, text]) => (
          <div key={title} className="flex items-center gap-3 border-[#ded8c9] lg:border-r lg:pr-5 last:border-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c9b27b] text-[#9b7426]">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-base text-[#25452c]">{title}</h3>
              <p className="mt-0.5 text-[9px] text-[#737c70]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="relative bg-[#123b2a] px-4 py-12 text-center text-white sm:px-6 lg:px-8">
      <Leaf className="absolute bottom-0 left-5 h-28 w-28 rotate-45 text-white/[.05]" />
      <div className="relative mx-auto max-w-xl">
        <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#dfbd69]">Wellness starts with knowing</p>
        <h2 className="mt-3 font-display text-3xl leading-tight text-[#fff5dd] sm:text-4xl">Carefully chosen.<br /><span className="italic text-[#d9b45c]">Clearly shared.</span></h2>
        <p className="mt-4 text-xs leading-6 text-white/65">Explore our products and their ingredient information before making them part of your routine.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d1a44b] px-6 py-3 text-[9px] font-black uppercase tracking-[.14em] text-[#173921]">Explore products <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
    </section>
  </div>
}
