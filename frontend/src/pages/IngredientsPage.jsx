import { ArrowRight, ChevronDown, FlaskConical, HeartPulse, Leaf, Search, ShieldCheck, Sprout, Trophy, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const ingredients = [
  ['Ashwagandha', 'Withania somnifera', 'Supports strength, stamina and overall vitality. Helps the body adapt to stress naturally.', 'ASWAGHANDHA.png'],
  ['Amla', 'Phyllanthus emblica', 'Rich in Vitamin C and antioxidants. Supports immunity, hair health and overall wellness.', 'AWALA.png'],
  ['Jamun', 'Syzygium cumini', 'Traditionally used to support healthy blood sugar levels and metabolism.', 'JAMUN.png'],
  ['Methi', 'Trigonella foenum-graecum', 'Supports healthy digestion, metabolism and helps maintain healthy blood sugar levels.', 'METHI.png'],
  ['Shatavari', 'Asparagus racemosus', "Supports women's health, hormonal balance and overall vitality.", 'satwari.png'],
  ['Neem', 'Azadirachta indica', 'Known for its purifying properties. Supports clearer skin and overall detoxification.', 'NEEM.png'],
  ['Shilajit', 'Asphaltum punjabianum', 'A natural source of minerals and fulvic acid. Supports energy, stamina and vitality.', 'Shilajit.png'],
  ['Garcinia', 'Garcinia cambogia', 'Supports weight management and helps curb cravings naturally.', 'carchinia.png'],
]

const promises = [[Leaf, 'Pure & natural', 'No artificial colors,\nflavors or chemicals.'], [FlaskConical, 'Backed by research', 'Traditional wisdom\nvalidated by modern science.'], [ShieldCheck, 'Quality assured', 'Every ingredient passes\nstrict quality and safety tests.'], [Sprout, 'Responsibly sourced', 'Sourced ethically to support\npeople and the planet.']]

const ingredientCategories = [
  [Leaf, 'All ingredients'],
  [Zap, 'Energy & vitality'],
  [ShieldCheck, 'Immunity & wellness'],
  [HeartPulse, 'Digestion & detox'],
  [Sprout, "Men's wellness"],
  [Trophy, 'Weight management'],
]

export default function IngredientsPage() {
  return <div className="overflow-hidden bg-[#fffdf7] text-[#19351f]">
    <section className="relative min-h-[330px] overflow-hidden border-b border-[#e5ddca] bg-[#f7f3e8] px-5 py-7 sm:min-h-[360px] sm:px-8 sm:py-9 lg:min-h-[405px] lg:px-12 lg:py-10">
      <img src="/images/ingredients/hero intge.png" alt="Mortar and pestle surrounded by carefully selected herbs and botanicals" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3e8]/95 via-[#f7f3e8]/82 to-transparent sm:via-[#f7f3e8]/58 lg:via-[#f7f3e8]/28" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="max-w-[22rem] sm:max-w-[27rem] lg:max-w-[31rem]">
          <p className="text-[12px] font-black uppercase tracking-[.08em] text-[#183822] sm:text-[15px]">Our ingredients</p>
          <h1 className="mt-2 font-display text-[2.15rem] font-bold uppercase leading-[.98] tracking-[.01em] text-[#183822] sm:text-[2.7rem] lg:text-[3.05rem]">Powered by <span className="text-[#a77925]">nature.</span><br />Crafted with purpose.</h1>
          <p className="mt-5 max-w-[18rem] text-[11px] font-medium leading-[1.65] text-[#263b2c] sm:text-xs">We believe that real wellness begins with real ingredients. Each herb we use is carefully selected for its purity, potency and purpose.</p>
          <div className="mt-5 grid max-w-[21rem] grid-cols-3 divide-x divide-[#d8cfae] text-center">
            <span className="flex flex-col items-center gap-1 px-2 text-[8px] font-bold leading-[1.25] text-[#263b2c]"><Leaf className="h-7 w-7 rounded-full border border-[#cdbd8c] p-1.5 text-[#8f6b26]" />Carefully<br />sourced</span>
            <span className="flex flex-col items-center gap-1 px-2 text-[8px] font-bold leading-[1.25] text-[#263b2c]"><FlaskConical className="h-7 w-7 rounded-full border border-[#cdbd8c] p-1.5 text-[#8f6b26]" />Scientifically<br />researched</span>
            <span className="flex flex-col items-center gap-1 px-2 text-[8px] font-bold leading-[1.25] text-[#263b2c]"><ShieldCheck className="h-7 w-7 rounded-full border border-[#cdbd8c] p-1.5 text-[#8f6b26]" />Quality<br />assured</span>
          </div>
        </div>
      </div>
    </section>

    <nav aria-label="Ingredient categories" className="bg-[#003720] text-[#f5d585]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {ingredientCategories.map(([Icon, label], index) => (
          <Link key={label} to="/ingredients" className={`flex min-h-[64px] flex-col items-center justify-center gap-1 border-[#1b573d] px-2 py-2 text-center text-[8px] font-bold uppercase tracking-[.06em] transition hover:bg-[#06482d] sm:min-h-[72px] ${index > 0 ? 'border-l' : ''}`}>
            <Icon className="h-5 w-5 text-[#d4ad4b]" />
            <span>{label}</span>
            {index === 0 && <span className="h-0.5 w-12 bg-[#c59b3f]" />}
          </Link>
        ))}
      </div>
    </nav>

    <section className="border-b border-[#e8e1d3] bg-[#fbfaf5] px-4 py-9 sm:px-8 sm:py-11 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h2 className="max-w-[240px] font-display text-[1.45rem] font-bold uppercase leading-[1.06] text-[#193923] sm:text-[1.65rem]">Nature&apos;s finest<br />ingredients</h2>
            <p className="mt-2 max-w-[205px] text-[10px] leading-[1.35] text-[#263b2c]">Our formulations combine the wisdom of Ayurveda with modern research to bring you the best of nature in every capsule.</p>
          </div>

          <div className="flex w-full gap-3 md:w-auto md:pt-1">
            <label className="flex h-9 flex-1 items-center gap-2 rounded-[3px] border border-[#ddd8cf] bg-white px-3 md:w-[320px]">
              <input aria-label="Search ingredients" placeholder="Search an ingredient..." className="w-full bg-transparent text-[10px] outline-none placeholder:text-[#a6a29b]" />
              <Search className="h-3.5 w-3.5 shrink-0 text-[#38483e]" />
            </label>
            <button type="button" className="flex h-9 w-[164px] items-center justify-between rounded-[3px] border border-[#ddd8cf] bg-white px-3 text-[10px] font-medium text-[#303a34]">
              Sort by: A to Z <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map(([name, , text, image]) => (
            <article key={name} className="group overflow-hidden rounded-[7px] border border-[#dfd9cc] bg-[#fffefa] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(17,33,25,0.1)]">
              <div className="h-[112px] overflow-hidden bg-[#efe9dc] sm:h-[118px]">
                <img
                  src={`/images/ingredients/${image}`}
                  alt={`${name} botanical ingredient`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3.5">
                <h3 className="flex items-center gap-1 font-sans text-[13px] font-black uppercase tracking-[.02em] text-[#1c3922]">{name} <Leaf className="h-3.5 w-3.5 text-[#5e8436]" fill="currentColor" strokeWidth={1.5} /></h3>
                <p className="mt-2 min-h-[48px] text-[11px] leading-[1.45] text-[#303b33]">{text}</p>
                <Link to="/products/lean-shape-garcinia-cambogia" className="mt-2 inline-flex items-center gap-2 rounded-[3px] border border-[#c8ad73] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[.03em] text-[#283b2c] transition hover:bg-[#f4ead1]">
                  Learn more <ArrowRight className="h-3 w-3 text-[#977126]" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden border-y border-[#e2dccd] bg-[#fbfaf3] px-4 py-5 sm:px-8 lg:px-10">
      <img src="/images/home/banner.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-90" />
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-[#e5dfcf] sm:grid-cols-4">
        {promises.map(([Icon, title, text]) => (
          <div key={title} className="flex min-h-[120px] flex-col items-center justify-center px-4 py-4 text-center sm:min-h-[140px]">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-[#b8a775] bg-[#fbfaf3]/80 text-[#557a38]">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-[13px] font-black uppercase tracking-[.05em] text-[#24392a] sm:text-[15px]">{title}</h3>
            <p className="mt-2 whitespace-pre-line text-[11px] font-medium leading-[1.5] text-[#4a5148] sm:text-[13px]">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="relative overflow-hidden border-y border-[#0b5735] bg-[#003c23]">
      <img src="/images/ingredients/ineven banner.png" alt="Natural ingredients and Divya Swasth wellness products" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-center px-8 py-10 sm:px-14 sm:py-12 lg:px-20 lg:py-14">
        <div className="max-w-[480px] flex flex-col items-center text-center">
          <h2 className="font-display text-[1.35rem] font-black uppercase leading-[1.05] tracking-[.04em] text-[#e8c35a] sm:text-[1.75rem] lg:text-[2.1rem]">Wellness that respects nature</h2>
          <p className="mt-3 text-[11px] font-medium leading-[1.6] text-white/90 sm:text-[12px]">
            Thoughtfully selected. Responsibly formulated.<br />Made for your better tomorrow.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-flex items-center gap-2 rounded-[3px] border border-[#c9a33a] px-5 py-2.5 text-[10px] font-black uppercase tracking-[.06em] text-[#e8c35a] transition hover:bg-[#c9a33a] hover:text-[#0c2b16] sm:text-[11px]"
          >
            Explore our products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>
}
