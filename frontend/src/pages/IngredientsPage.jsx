import { ArrowRight, FlaskConical, Leaf, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const ingredients = [
  {
    name: 'Garcinia Cambogia Extract',
    type: 'Fruit extract',
    text: 'A tropical fruit extract included in the planned Lean Shape botanical formula.',
    image: '/images/ingredients/garcinia-cambogia.webp',
    imageAlt: 'Garcinia cambogia fruit with botanical extract powder',
  },
  {
    name: 'Green Coffee Bean Extract',
    type: 'Bean extract',
    text: 'An extract from unroasted coffee beans; exact standardisation must match the final label.',
    image: '/images/ingredients/green-coffee-bean.webp',
    imageAlt: 'Raw green coffee beans, coffee leaves and extract powder',
  },
  {
    name: 'Green Tea Extract',
    type: 'Leaf extract',
    text: 'A concentrated botanical ingredient whose final quantity and specification require label confirmation.',
    image: '/images/ingredients/green-tea-extract.webp',
    imageAlt: 'Fresh and dried green tea leaves with extract powder',
  },
  {
    name: 'Guggul Extract',
    type: 'Botanical resin',
    text: 'A traditional botanical resin used in Indian wellness traditions.',
    image: '/images/ingredients/guggul-resin.webp',
    imageAlt: 'Natural guggul resin with a Commiphora plant branch and extract powder',
  },
  {
    name: 'Piperine / Black Pepper Extract',
    type: 'Spice extract',
    text: 'A black pepper-derived ingredient; the final declared name must follow the approved formula.',
    image: '/images/ingredients/black-pepper-piperine.webp',
    imageAlt: 'Black peppercorns, pepper vine and botanical extract powder',
  },
  {
    name: 'Chromium Picolinate',
    type: 'Nutritional ingredient',
    text: 'A chromium-containing nutritional ingredient; exact quantity must be declared on the final label.',
    image: '/images/ingredients/chromium-picolinate.webp',
    imageAlt: 'Nutritional ingredient powder in a clean laboratory weighing dish',
  },
  {
    name: 'L-Carnitine',
    type: 'Nutrient-like compound',
    text: 'A nutrient-like compound planned for the formulation, subject to final classification and quantity.',
    image: '/images/ingredients/l-carnitine.webp',
    imageAlt: 'Fine crystalline formulation ingredient in clean laboratory glassware',
  },
  {
    name: 'Ginger Extract',
    type: 'Rhizome extract',
    text: 'A familiar botanical used in traditional food and wellness routines.',
    image: '/images/ingredients/ginger-extract.webp',
    imageAlt: 'Fresh sliced ginger rhizomes with botanical extract powder',
  },
]

export default function IngredientsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[#0b271b] px-4 py-24 text-white">
        <Leaf className="animate-drift absolute -right-16 -top-10 h-80 w-80 text-white/[.04]" strokeWidth={0.5} />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#dfb75e]">Ingredient library</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[.98] text-[#fff6df] sm:text-7xl">
            Know what is inside.<br /><span className="italic text-[#d9b55f]">Understand why.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58">A transparent look at the ingredients currently planned for Lean Shape. Final names, grades and quantities must exactly match the approved formulation and label.</p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ingredients.map((ingredient, index) => (
              <article key={ingredient.name} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#dfe5da] bg-white shadow-[0_10px_30px_rgba(29,58,38,.04)] transition duration-500 hover:-translate-y-1.5 hover:border-[#c9a34d] hover:shadow-[0_22px_55px_rgba(29,58,38,.12)]">
                <div className="relative h-40 overflow-hidden bg-[#e8eee4]">
                  <img
                    src={ingredient.image}
                    alt={ingredient.imageAlt}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08271b]/45 via-transparent to-black/[.04]" />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/55 bg-white/90 font-display text-lg font-bold text-[#a7741c] shadow-sm backdrop-blur-md">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/40 bg-[#0a2b1e]/80 px-3 py-1.5 text-[7px] font-black uppercase tracking-[.11em] text-[#f0ce77] backdrop-blur-md">
                    {ingredient.type}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-2xl leading-tight text-[#193924]">{ingredient.name}</h2>
                  <p className="mt-3 text-xs leading-6 text-[#6a776e]">{ingredient.text}</p>
                  <Link to="/products/lean-shape-garcinia-cambogia" className="mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-[8px] font-black uppercase tracking-wider text-[#95671a]" aria-label={`View ${ingredient.name} in the planned Lean Shape formula`}>
                    View planned formula <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-5 rounded-[2.5rem] bg-[#eff2e9] p-7 sm:grid-cols-3 sm:p-10">
            {[
              [Leaf, 'Carefully selected', 'Selection criteria should be documented for each final ingredient.'],
              [FlaskConical, 'Exact quantities', 'Publish only quantities appearing on the approved final label.'],
              [ShieldCheck, 'Responsible information', 'Ingredient education is not a disease-treatment claim.'],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-2xl bg-white p-6">
                <Icon className="h-6 w-6 text-[#9c701d]" />
                <h3 className="mt-5 font-display text-xl text-[#193824]">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#6b776f]">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products/lean-shape-garcinia-cambogia" className="inline-flex items-center gap-2 rounded-full bg-[#123b2a] px-8 py-4 text-[10px] font-black uppercase tracking-[.15em] text-white">
              Explore Lean Shape <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
