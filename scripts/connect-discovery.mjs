import fs from 'node:fs'
let s = fs.readFileSync('frontend/src/pages/IngredientsPage.jsx', 'utf8')
s = "import { useState } from 'react'\n" + s
s = s.replace("const siteContent = useSiteContent('ingredients', siteIcons)", `const siteContent = useSiteContent('ingredients', siteIcons)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(0)
  const [descending, setDescending] = useState(false)
  const groups = [[], [0, 6], [1, 4, 5], [3, 5], [0, 6], [7, 3]]
  const visible = siteContent.sections.ingredients.filter((item, index) => (!category || groups[category].includes(index)) && item.slice(0, 3).join(' ').toLowerCase().includes(query.toLowerCase()))
  const ingredients = query || category || descending ? [...visible].sort((a, b) => (descending ? -1 : 1) * a[0].localeCompare(b[0])) : visible`)
s = s.replace('<Link key={label} to={siteContent.media.to_3}', '<button type="button" onClick={() => setCategory(index)} aria-pressed={category === index} key={label}').replace('index === 0 &&', 'index === category &&').replace('          </Link>\n        ))}', '          </button>\n        ))}')
s = s.replace('<input aria-label="Search ingredients"', '<input value={query} onChange={event => setQuery(event.target.value)} aria-label="Search ingredients"')
s = s.replace('<button type="button" className="flex h-9 w-[164px]', '<button type="button" onClick={() => setDescending(value => !value)} className="flex h-9 w-[164px]')
s = s.replace('{siteContent.text.sort_by_a_to_z}', "{descending ? 'Sort by: Z to A' : siteContent.text.sort_by_a_to_z}").replace('siteContent.sections.ingredients.map', 'ingredients.map')
s = s.replace('to={siteContent.media.to_5}', 'to={`/shop?search=${encodeURIComponent(name)}`}')
s = s.replace('<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">', '<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">\n          {!ingredients.length && <p className="col-span-full py-8 text-center text-sm">No matching ingredients. Try another search or category.</p>}')
fs.writeFileSync('frontend/src/pages/IngredientsPage.jsx', s)
s = fs.readFileSync('frontend/src/pages/WellnessPage.jsx', 'utf8')
s = "import { apiRequest } from '../api/client.js'\n" + s
s = s.replace("const [selectedGoal, setSelectedGoal] = useState('')", `const [selectedGoal, setSelectedGoal] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [finding, setFinding] = useState(false)
  const [recommendationError, setRecommendationError] = useState('')
  useEffect(() => {
    if (!selectedGoal) return
    let active = true
    const index = siteContent.sections.WELLNESS_GOALS.findIndex(goal => goal.title === selectedGoal)
    setFinding(true); setRecommendationError(''); setRecommendations([])
    apiRequest('/wellness/recommendations?goal=' + index).then(data => { if (active) setRecommendations(data.products) }).catch(error => { if (active) setRecommendationError(error.message) }).finally(() => { if (active) setFinding(false) })
    return () => { active = false }
  }, [selectedGoal, siteContent.sections.WELLNESS_GOALS])`)
const marker = '      <section className="px-4 pb-5 pt-3 sm:px-6 lg:px-8">'
s = s.replace(marker, `{selectedGoal && <section className="mx-auto max-w-5xl px-5 py-8" aria-live="polite"><h2 className="font-display text-2xl">Your wellness selection</h2><p className="mt-2 text-xs text-[#68785c]">Explore products selected for your chosen goal. Check each product’s information before purchasing.</p>{finding ? <p className="py-5 text-sm">Finding your products…</p> : recommendationError ? <p role="alert" className="py-5 text-sm">{recommendationError}</p> : recommendations.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{recommendations.map(product => <Link key={product._id} to={'/products/' + product.slug} className="flex items-center gap-4 rounded-lg border border-[#dce4d5] bg-white p-4">{product.images[0] && <img className="h-20 w-20 object-contain" src={product.images[0]} alt="" />}<span><strong className="block">{product.name}</strong><span className="mt-1 block text-xs">{product.subtitle}</span><b className="mt-2 block text-sm">₹{product.price.toLocaleString('en-IN')}</b></span><ArrowRight size={16} className="ml-auto" /></Link>)}</div> : <p className="py-5 text-sm">No products are listed for this goal yet. Explore our full collection.</p>}</section>}

` + marker)
fs.writeFileSync('frontend/src/pages/WellnessPage.jsx', s)
